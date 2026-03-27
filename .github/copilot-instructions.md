# FanHub Copilot Instructions

> **Active implementation**: `dotnet/` — ASP.NET Core Web API backend + Blazor Server frontend
> **Purpose**: Workshop codebase with intentional bugs. The goal is to fix them using GitHub Copilot.

---

## Project Overview

FanHub is a Breaking Bad fan site. It serves characters, episodes, quotes, and show data through a REST API consumed by a Blazor Server frontend.

- **Backend**: ASP.NET Core 10 Web API — `dotnet/Backend/`
- **Frontend**: Blazor Server — `dotnet/Frontend/`
- **Database**: SQLite via Entity Framework Core 10 (file: `fanhub.db`)
- **ORM**: Direct `FanHubContext` (no repository layer)
- **Seed data**: `Backend/Data/SeedData.cs` — runs on startup via `SeedData.Initialize(context)`

Other language implementations (`node/`, `go/`, `java/`) exist but are **not the focus**.

---

## Build & Run Commands

```bash
# Backend
cd dotnet/Backend
dotnet restore
dotnet ef database update     # creates fanhub.db from migrations
dotnet run                    # starts on http://localhost:5265

# Frontend
cd dotnet/Frontend
dotnet restore
dotnet run                    # starts on http://localhost:3000

# Tests
cd dotnet/Backend.Tests
dotnet test
```

Docker alternative:

```bash
cd dotnet
docker compose up -d
```

---

## Architecture

### Backend

| Layer       | Location                        | Notes                                                   |
| ----------- | ------------------------------- | ------------------------------------------------------- |
| Controllers | `Backend/Controllers/`          | Direct DbContext injection, no services layer           |
| Models      | `Backend/Models/`               | EF Core entities                                        |
| DbContext   | `Backend/Data/FanHubContext.cs` | Missing `OnModelCreating` — no relationships configured |
| Migrations  | `Backend/Migrations/`           | EF Core migrations                                      |
| Seed data   | `Backend/Data/SeedData.cs`      | Runs on every startup                                   |

### API Routes

| Controller        | Endpoints                                               |
| ----------------- | ------------------------------------------------------- |
| `/api/characters` | GET (list), GET `{id}`, POST, PUT `{id}`, DELETE `{id}` |
| `/api/shows`      | GET (list), GET `{id}`, POST, PUT `{id}`, DELETE `{id}` |
| `/api/episodes`   | GET (`?season={id}` optional), GET `{id}`, POST         |
| `/api/quotes`     | GET (list), GET `{id}`, POST, POST `{id}/like`          |
| `/api/auth`       | POST `/register`, POST `/login`                         |

### Frontend

| Component    | File                                         | Notes                       |
| ------------ | -------------------------------------------- | --------------------------- |
| Landing page | `Frontend/Components/Pages/Home.razor`       | Hero + stat cards + nav     |
| Characters   | `Frontend/Components/Pages/Characters.razor` | Grid + detail modal         |
| Episodes     | `Frontend/Components/Pages/Episodes.razor`   | List with season filter     |
| Layout       | `Frontend/Components/Layout/`                | NavBar, NavMenu, MainLayout |

**HttpClient configuration**: Base URL set from `appsettings.Development.json` → `BackendUrl` key (defaults to `http://localhost:5265`). Injected via `@inject HttpClient Http`.

---

## Conventions

- **Namespace**: `Backend.Controllers`, `Backend.Models`, `Backend.Data`
- **Route convention**: `[Route("api/[controller]")]` — controller name maps to route
- **Controller naming**: `{Entity}Controller.cs` (plural entity names)
- **Async pattern**: `FindAsync()`, `ToListAsync()`, `SaveChangesAsync()`
- **Frontend data fetch**: `await Http.GetFromJsonAsync<T>("api/endpoint")`
- **No repository pattern** — controllers inject `FanHubContext` directly
- **No authentication middleware** — auth stub exists but is not enforced

---

## Known Intentional Bugs

> See [`dotnet/BUGS.md`](../dotnet/BUGS.md) for the full catalog (62 bugs total).

### Critical (fix these first)

| Bug                         | Location                     | Issue                               |
| --------------------------- | ---------------------------- | ----------------------------------- |
| NullReferenceException      | `CharactersController.cs:30` | No null check on `FindAsync` result |
| NullReferenceException      | `CharactersController.cs:62` | `Remove(null)` crashes EF Core      |
| NullReferenceException      | `ShowsController.cs:28,66`   | Same pattern as above               |
| MD5 password hashing        | `AuthController.cs:93`       | Completely insecure — use BCrypt    |
| Hardcoded connection string | `Backend/Program.cs`         | Move to `appsettings.json`          |
| Duplicate Jesse Pinkman     | `SeedData.cs:94,128`         | Character inserted twice            |

### High Priority

| Bug                            | Location                                  | Issue                                       |
| ------------------------------ | ----------------------------------------- | ------------------------------------------- |
| `SaveChangesAsync` not awaited | `CharactersController`, `ShowsController` | Fire-and-forget update                      |
| Wide-open CORS                 | `Backend/Program.cs`                      | `AllowAnyOrigin` — lock down in production  |
| N+1 queries                    | `ShowsController`, `QuotesController`     | Missing `.Include()` calls                  |
| Season filter ignored          | `Episodes.razor`                          | Caching bug returns all episodes regardless |
| Static event leak              | `Characters.razor`                        | `OnCharacterSelected` never unsubscribed    |
| Wrong HTTP status              | Multiple controllers                      | POST should return 201, not 200             |
| Missing DELETE                 | `QuotesController`                        | No delete endpoint                          |

---

## Models Reference

```csharp
Character  { Id, ShowId, Name, ActorName, Bio, Tagline, CharacterType,
             IsMainCharacter, Status, ImageUrl }
Show       { Id, Title, Description, Genre, StartYear, EndYear, Network }
Episode    { Id, ShowId, SeasonId, EpisodeNumber, Title, Description,
             RuntimeMinutes, AirDate }
Season     { Id, ShowId, SeasonNumber, Title, EpisodeCount }
Quote      { Id, ShowId, CharacterId, EpisodeId, QuoteText, IsFamous, Likes }
User       { Id, Email, PasswordHash, Username, DisplayName, Role }
```

Navigation properties exist on models but EF relationships are **not configured** in `FanHubContext.OnModelCreating` — this is a known bug.

---

## Docs & Reference

- [`dotnet/BUGS.md`](../dotnet/BUGS.md) — Full bug catalog with evidence and fix guidance
- [`dotnet/SETUP.md`](../dotnet/SETUP.md) — Detailed setup instructions
- [`dotnet/docs/FEATURE-CHARACTER-DETAIL.md`](../dotnet/docs/FEATURE-CHARACTER-DETAIL.md) — Spec for the next feature to build
- [`docs/breaking-bad-universe.md`](../docs/breaking-bad-universe.md) — Domain lore: characters, locations, show history
