using System.ComponentModel.DataAnnotations;
using Backend.Models;
using Xunit;

namespace Backend.Tests;

public class ModelValidationTests
{
    [Fact]
    public void Valid_models_pass_validation_and_nullable_fields_remain_optional()
    {
        var character = new Character
        {
            Name = "Walter White",
            ActorName = "Bryan Cranston",
            Bio = "A chemistry teacher.",
            Status = "Alive",
            ImageUrl = null,
            Tagline = "I am the danger.",
            CharacterType = "Main"
        };
        var show = new Show
        {
            Title = "Breaking Bad",
            Description = "A chemistry teacher enters the drug trade.",
            Genre = "Drama",
            Network = "AMC",
            EndYear = null
        };

        Assert.Empty(Validate(character));
        Assert.Empty(Validate(show));
    }

    [Theory]
    [InlineData(nameof(Character.Name))]
    [InlineData(nameof(Character.ActorName))]
    [InlineData(nameof(Character.Bio))]
    [InlineData(nameof(Character.Status))]
    [InlineData(nameof(Character.Tagline))]
    [InlineData(nameof(Character.CharacterType))]
    public void Character_required_fields_reject_empty_values(string propertyName)
    {
        var character = new Character
        {
            Name = "Name",
            ActorName = "Actor",
            Bio = "Bio",
            Status = "Status",
            Tagline = "Tagline",
            CharacterType = "Type"
        };

        typeof(Character).GetProperty(propertyName)!.SetValue(character, string.Empty);

        Assert.Contains(Validate(character), result => result.MemberNames.Contains(propertyName));
    }

    [Theory]
    [InlineData(nameof(Show.Title))]
    [InlineData(nameof(Show.Description))]
    [InlineData(nameof(Show.Genre))]
    [InlineData(nameof(Show.Network))]
    public void Show_required_fields_reject_empty_values(string propertyName)
    {
        var show = new Show
        {
            Title = "Title",
            Description = "Description",
            Genre = "Genre",
            Network = "Network"
        };

        typeof(Show).GetProperty(propertyName)!.SetValue(show, string.Empty);

        Assert.Contains(Validate(show), result => result.MemberNames.Contains(propertyName));
    }

    [Fact]
    public void Show_title_rejects_more_than_200_characters()
    {
        var show = new Show
        {
            Title = new string('x', 201),
            Description = "Description",
            Genre = "Genre",
            Network = "Network"
        };

        Assert.Contains(Validate(show), result => result.MemberNames.Contains(nameof(Show.Title)));
    }

    [Fact]
    public void User_email_requires_email_format_and_other_required_fields_are_present()
    {
        var user = new User
        {
            Email = "not-an-email",
            PasswordHash = "hash",
            Username = "user",
            DisplayName = "User",
            Role = "user"
        };

        Assert.Contains(Validate(user), result => result.MemberNames.Contains(nameof(User.Email)));
    }

    [Theory]
    [InlineData(typeof(Episode), nameof(Episode.Title))]
    [InlineData(typeof(Episode), nameof(Episode.Description))]
    [InlineData(typeof(Quote), nameof(Quote.QuoteText))]
    public void Episode_and_quote_required_fields_reject_empty_values(Type modelType, string propertyName)
    {
        var model = Activator.CreateInstance(modelType)!;
        modelType.GetProperty(propertyName)!.SetValue(model, string.Empty);

        Assert.Contains(Validate(model), result => result.MemberNames.Contains(propertyName));
    }

    private static IList<ValidationResult> Validate(object model)
    {
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(model, new ValidationContext(model), results, validateAllProperties: true);
        return results;
    }
}
