using Frontend.Components;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

// FIX: Configure HttpClient with base address from configuration
// BUG (workshop): Move the URL to environment-specific config for deployment
var backendUrl = builder.Configuration["BackendUrl"] ?? "http://localhost:5265";
builder.Services.AddHttpClient("default", client => client.BaseAddress = new Uri(backendUrl));
builder.Services.AddScoped(sp => sp.GetRequiredService<IHttpClientFactory>().CreateClient("default"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
}
app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
