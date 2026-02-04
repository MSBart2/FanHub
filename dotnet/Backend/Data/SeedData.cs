using Backend.Data;
using Backend.Models;

namespace Backend.Data;

public static class SeedData
{
    public static void Initialize(FanHubContext context)
    {
        // Ensure database is created
        context.Database.EnsureCreated();
        
        // Check if already seeded
        if (context.Shows.Any())
        {
            return;  // DB has been seeded
        }
        
        // Insert Breaking Bad show
        var show = new Show
        {
            Title = "Breaking Bad",
            Description = "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student to secure his family's future.",
            Genre = "Crime Drama",
            StartYear = 2008,
            EndYear = 2013,
            Network = "AMC"
        };
        context.Shows.Add(show);
        context.SaveChanges();
        
        // Insert seasons
        var seasons = new[]
        {
            new Season { ShowId = show.Id, SeasonNumber = 1, Title = "Season 1", EpisodeCount = 7 },
            new Season { ShowId = show.Id, SeasonNumber = 2, Title = "Season 2", EpisodeCount = 13 },
            new Season { ShowId = show.Id, SeasonNumber = 3, Title = "Season 3", EpisodeCount = 13 },
            new Season { ShowId = show.Id, SeasonNumber = 4, Title = "Season 4", EpisodeCount = 13 },
            new Season { ShowId = show.Id, SeasonNumber = 5, Title = "Season 5", EpisodeCount = 16 }
        };
        context.Seasons.AddRange(seasons);
        context.SaveChanges();
        
        // Insert episodes (Season 1 only)
        var episodes = new[]
        {
            new Episode
            {
                ShowId = show.Id,
                SeasonId = seasons[0].Id,
                EpisodeNumber = 1,
                Title = "Pilot",
                Description = "Walter White, a chemistry teacher, is diagnosed with inoperable lung cancer and turns to a life of crime.",
                RuntimeMinutes = 58,
                AirDate = new DateTime(2008, 1, 20)
            },
            new Episode
            {
                ShowId = show.Id,
                SeasonId = seasons[0].Id,
                EpisodeNumber = 2,
                Title = "Cat's in the Bag...",
                Description = "Walt and Jesse attempt to tie up loose ends. The desperate situation gets more complicated with the flip of a coin.",
                RuntimeMinutes = 48,
                AirDate = new DateTime(2008, 1, 27)
            },
            new Episode
            {
                ShowId = show.Id,
                SeasonId = seasons[0].Id,
                EpisodeNumber = 3,
                Title = "And the Bag's in the River",
                Description = "Walt and Jesse clean up after the bathtub incident before Walt decides what to do with their prisoner.",
                RuntimeMinutes = 48,
                AirDate = new DateTime(2008, 2, 10)
            }
        };
        context.Episodes.AddRange(episodes);
        context.SaveChanges();
        
        // Insert characters
        // BUG: DUPLICATE JESSE PINKMAN! (Same as Node.js version bug)
        var characters = new[]
        {
            new Character
            {
                ShowId = show.Id,
                Name = "Walter White",
                ActorName = "Bryan Cranston",
                Bio = "A mild-mannered high school chemistry teacher who transforms into a ruthless methamphetamine manufacturer known as \"Heisenberg\".",
                IsMainCharacter = true,
                Status = "deceased"
            },
            new Character
            {
                ShowId = show.Id,
                Name = "Jesse Pinkman",
                ActorName = "Aaron Paul",
                Bio = "Walt's former student and business partner. A small-time methamphetamine manufacturer and dealer.",
                IsMainCharacter = true,
                Status = "alive"
            },
            new Character
            {
                ShowId = show.Id,
                Name = "Skyler White",
                ActorName = "Anna Gunn",
                Bio = "Walter's wife, a bookkeeper who becomes increasingly suspicious of Walt's activities.",
                IsMainCharacter = true,
                Status = "alive"
            },
            new Character
            {
                ShowId = show.Id,
                Name = "Hank Schrader",
                ActorName = "Dean Norris",
                Bio = "Walter's brother-in-law, a DEA agent pursuing the elusive drug lord Heisenberg.",
                IsMainCharacter = true,
                Status = "deceased"
            },
            // BUG: DUPLICATE JESSE PINKMAN - Same as Node.js seed data bug!
            new Character
            {
                ShowId = show.Id,
                Name = "Jesse Pinkman",
                ActorName = "Aaron Paul",
                Bio = "Walt's former student and partner in the methamphetamine business.",
                IsMainCharacter = true,
                Status = "alive"
            },
            new Character
            {
                ShowId = show.Id,
                Name = "Saul Goodman",
                ActorName = "Bob Odenkirk",
                Bio = "A criminal lawyer who becomes Walt and Jesse's legal counsel and adviser.",
                IsMainCharacter = false,
                Status = "alive"
            }
        };
        context.Characters.AddRange(characters);
        context.SaveChanges();
        
        // Insert quotes (some reference the duplicate Jesse)
        var quotes = new[]
        {
            new Quote
            {
                ShowId = show.Id,
                CharacterId = characters[0].Id,  // Walter
                EpisodeId = episodes[0].Id,
                QuoteText = "I am not in danger, Skyler. I am the danger!",
                IsFamous = true,
                Likes = 0
            },
            new Quote
            {
                ShowId = show.Id,
                CharacterId = characters[1].Id,  // Jesse (first one)
                EpisodeId = episodes[0].Id,
                QuoteText = "Yeah, science!",
                IsFamous = true,
                Likes = 0
            },
            new Quote
            {
                ShowId = show.Id,
                CharacterId = characters[0].Id,  // Walter
                EpisodeId = episodes[2].Id,
                QuoteText = "Say my name.",
                IsFamous = true,
                Likes = 0
            },
            // BUG: This quote references the DUPLICATE Jesse (index 4)!
            new Quote
            {
                ShowId = show.Id,
                CharacterId = characters[4].Id,  // Jesse DUPLICATE!
                EpisodeId = episodes[1].Id,
                QuoteText = "Yeah, Mr. White! Yeah, science!",
                IsFamous = false,
                Likes = 0
            }
        };
        context.Quotes.AddRange(quotes);
        context.SaveChanges();
        
        // Insert test admin user
        // BUG: Insecure MD5 hash (matching AuthController's hash method)
        // Password is "admin123" - MD5: 0192023a7bbd73250516f069df18b500
        var adminUser = new User
        {
            Email = "admin@fanhub.test",
            Username = "admin",
            DisplayName = "Admin User",
            PasswordHash = "0192023a7bbd73250516f069df18b500",
            Role = "admin"
        };
        context.Users.Add(adminUser);
        context.SaveChanges();
    }
}
