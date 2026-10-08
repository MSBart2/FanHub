using System.Net;
using System.Net.Http.Json;
using Bunit;
using Frontend.Components.Pages;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Frontend.Tests;

public class HomeTests : TestContext
{
    [Fact]
    public void HomeEnablesInteractiveServerRenderingForRetry()
    {
        var renderMode = Assert.Single(typeof(Home).GetCustomAttributes(typeof(RenderModeAttribute), false));
        Assert.IsType<InteractiveServerRenderMode>(((RenderModeAttribute)renderMode).Mode);
    }

    [Fact]
    public void SuccessfulLoadRendersCharacterCountAndQuote()
    {
        var handler = new QueueHttpMessageHandler(
            Response(HttpStatusCode.OK, new[] { new Character(1, "Walter White"), new Character(2, "Jesse Pinkman") }),
            Response(HttpStatusCode.OK, new[] { new Quote(1, 1, "I am the one who knocks.", true) }));
        RegisterHttpClient(handler);

        var cut = RenderComponent<Home>();

        cut.WaitForAssertion(() =>
        {
            Assert.Contains("2", cut.Find(".summary-stat:nth-child(2)").TextContent);
            Assert.Contains("I am the one who knocks.", cut.Markup);
            Assert.DoesNotContain("role=\"alert\"", cut.Markup);
        });
    }

    [Fact]
    public void CharacterFailureRendersAccessibleRetryMessageWithoutExceptionDetails()
    {
        var handler = new QueueHttpMessageHandler(
            new HttpRequestExceptionResponse("character backend failed"));
        RegisterHttpClient(handler);

        var cut = RenderComponent<Home>();

        cut.WaitForAssertion(() =>
        {
            Assert.Equal("alert", cut.Find("[role='alert']").GetAttribute("role"));
            Assert.Contains("couldn't load", cut.Find("[role='alert']").TextContent);
            Assert.DoesNotContain("character backend failed", cut.Markup);
            Assert.Equal(1, handler.RequestCount);
        });
    }

    [Fact]
    public void QuoteFailureRendersAccessibleRetryMessage()
    {
        var handler = new QueueHttpMessageHandler(
            Response(HttpStatusCode.OK, new[] { new Character(1, "Walter White") }),
            new HttpRequestExceptionResponse("quote backend failed"));
        RegisterHttpClient(handler);

        var cut = RenderComponent<Home>();

        cut.WaitForAssertion(() =>
        {
            Assert.Contains("Please try again", cut.Find("[role='alert']").TextContent);
            Assert.DoesNotContain("quote backend failed", cut.Markup);
            Assert.Equal(2, handler.RequestCount);
        });
    }

    [Fact]
    public async Task RetryRerunsRequestsAndRendersRecoveredData()
    {
        var handler = new QueueHttpMessageHandler(
            new HttpRequestExceptionResponse("temporary failure"),
            Response(HttpStatusCode.OK, new[] { new Character(1, "Walter White") }),
            Response(HttpStatusCode.OK, new[] { new Quote(1, 1, "Recovered quote", true) }));
        RegisterHttpClient(handler);

        var cut = RenderComponent<Home>();
        cut.WaitForAssertion(() => Assert.True(cut.FindAll("[role='alert']").Count == 1));

        await cut.Find("button").ClickAsync(new Microsoft.AspNetCore.Components.Web.MouseEventArgs());

        cut.WaitForAssertion(() =>
        {
            Assert.DoesNotContain("role=\"alert\"", cut.Markup);
            Assert.Contains("Recovered quote", cut.Markup);
            Assert.Equal(3, handler.RequestCount);
        });
    }

    [Fact]
    public async Task RetryKeepsAlertVisibleUntilBothRequestsSucceed()
    {
        var pendingQuote = new DeferredResponse();
        var handler = new QueueHttpMessageHandler(
            new HttpRequestExceptionResponse("temporary failure"),
            Response(HttpStatusCode.OK, new[] { new Character(1, "Walter White") }),
            pendingQuote);
        RegisterHttpClient(handler);

        var cut = RenderComponent<Home>();
        cut.WaitForElement("[role='alert']");

        var retry = cut.Find(".btn-retry").ClickAsync(new Microsoft.AspNetCore.Components.Web.MouseEventArgs());
        cut.WaitForAssertion(() =>
        {
            Assert.Contains("Retrying...", cut.Find("[role='alert']").TextContent);
            Assert.True(cut.Find(".btn-retry").HasAttribute("disabled"));
        });

        pendingQuote.Completion.SetResult(Response(HttpStatusCode.OK, new[] { new Quote(1, 1, "Recovered quote", true) }));
        await retry;

        cut.WaitForAssertion(() =>
        {
            Assert.Empty(cut.FindAll("[role='alert']"));
            Assert.Contains("Recovered quote", cut.Markup);
        });
    }

    private static HttpResponseMessage Response<T>(HttpStatusCode statusCode, T value) =>
        new(statusCode) { Content = JsonContent.Create(value) };

    private void RegisterHttpClient(QueueHttpMessageHandler handler)
    {
        Services.AddSingleton<HttpClient>(_ => new HttpClient(handler) { BaseAddress = new Uri("http://localhost/") });
    }

    private sealed record Character(int Id, string Name);

    private sealed record Quote(int Id, int CharacterId, string QuoteText, bool IsFamous);

    private sealed class HttpRequestExceptionResponse(string message) : HttpResponseMessage(HttpStatusCode.InternalServerError)
    {
        public string ErrorMessage { get; } = message;
    }

    private sealed class DeferredResponse : HttpResponseMessage
    {
        public TaskCompletionSource<HttpResponseMessage> Completion { get; } =
            new(TaskCreationOptions.RunContinuationsAsynchronously);
    }

    private sealed class QueueHttpMessageHandler(params HttpResponseMessage[] responses) : HttpMessageHandler
    {
        private readonly Queue<HttpResponseMessage> responseQueue = new(responses);

        public int RequestCount { get; private set; }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            RequestCount++;
            if (responseQueue.Count == 0)
            {
                throw new InvalidOperationException("No response configured for request.");
            }

            var response = responseQueue.Dequeue();
            if (response is HttpRequestExceptionResponse failure)
            {
                throw new HttpRequestException(failure.ErrorMessage);
            }
            if (response is DeferredResponse pending)
            {
                return pending.Completion.Task;
            }

            return Task.FromResult(response);
        }
    }
}
