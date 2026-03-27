# Plan: "Universe at a Glance" Stat Cards

## TL;DR

Build the "Universe at a Glance" live stat cards. Requires two new backend models (Location, ShowLore), controllers with GET-only endpoints, DbContext updates, seed data, a new EF migration, JS count-up animation, and a Razor homepage section with the cards. Character and Location data already exists in the database — no write UI is needed.

---

## Phase 1 — Backend models + data (blocks everything)

### Step 1: Create `Location` model

- New file: `dotnet/Backend/Models/Location.cs`
- Fields: `Id` (int), `ShowId` (int), `Name` (string), `Description` (string), `Type` (string — e.g., "Business", "Residence", "Landmark")
- Follow pattern of `Character.cs` — no navigation virtual props

### Step 2: Create `ShowLore` model

- New file: `dotnet/Backend/Models/ShowLore.cs`
- Fields: `Id` (int), `ShowId` (int), `Title` (string), `Content` (string)

### Step 3: Update `FanHubContext`

- File: `dotnet/Backend/Data/FanHubContext.cs`
- Add: `public DbSet<Location> Locations { get; set; }` and `public DbSet<ShowLore> ShowLore { get; set; }`

### Step 4: Add seed data

- File: `dotnet/Backend/Data/SeedData.cs`
- Add seeding inside the existing `if (context.Shows.Any()) return;` guard block
- ~8 Locations: Los Pollos Hermanos, White residence, A1A Car Wash, Superlab, RV, DEA field office, Saul's office, Schrader residence
- ~8 ShowLore entries: production facts, symbolism (pink teddy bear, colors), awards, Walt Whitman connection — sourced from `docs/breaking-bad-universe.md`

### Step 5: Run EF migration (manual — user action)

```bash
cd dotnet/Backend
dotnet ef migrations add AddLocationsAndShowLore
dotnet ef database update
```

---

## Phase 2 — Controllers (parallel with Phase 3, depends on Phase 1)

### Step 6: Create `LocationsController`

- New file: `dotnet/Backend/Controllers/LocationsController.cs`
- Inject `FanHubContext` via constructor
- `GET /api/locations` — returns `Ok(await _context.Locations.ToListAsync())`
- `GET /api/locations/{id}` — returns 404 if null, 200 otherwise
- No POST — data is managed via seed data only

### Step 7: Create `ShowLoreController`

- New file: `dotnet/Backend/Controllers/ShowLoreController.cs`
- Same read-only pattern as LocationsController
- `GET /api/showlore`, `GET /api/showlore/{id}`
- No POST — data is managed via seed data only

---

## Phase 3 — Frontend JS (parallel with Phase 2, blocks Phase 4)

### Step 8: Create `animations.js`

- New file: `dotnet/Frontend/wwwroot/js/animations.js`
- `window.animateCount(elementId, start, end, duration)` using `requestAnimationFrame`
- Linear interpolation over duration ms, updates element's `innerText`

### Step 9: Add script reference to `App.razor`

- File: `dotnet/Frontend/Components/App.razor`
- Add `<script src="js/animations.js"></script>` before closing `</body>`

---

## Phase 4 — Frontend `Home.razor` (depends on Phases 2 and 3)

### Step 10: Inline model classes in `@code`

- Add `Location` and `ShowLore` inline classes at the bottom of the `@code` block
- Follow the inline class pattern from `Characters.razor`
- No form/entry model needed

### Step 11: State + data-fetch logic in `@code`

- Add `@inject IJSRuntime JS`
- Fields: `int characterCount`, `int locationCount`, `int loreCount`
- `OnInitializedAsync`: fetch all three lists, store `.Count` values
- `OnAfterRenderAsync(bool firstRender)`: on firstRender, call `animateCount` for all 3 cards
- No form state, no submit handler

### Step 12: Add "Universe at a Glance" section HTML

- Insert `<section class="universe-glance">` between `show-summary` and `nav-cards`
- Three `.glance-card` elements with `id="count-characters"` etc. spans: ⚗️ Characters, 📍 Locations, 📖 Show Lore
- No toggle button, no form panel

### Step 13: Add scoped CSS in `Home.razor`'s `<style>` block

- `.universe-glance` — grid layout, padding, border-top
- `.glance-card` — dark bg (`#1a1a1a`), border-radius, padding, hover lift (`transform: translateY(-2px)`)
- `.glance-count` — color `#62d962`, large font-size, font-weight 900

---

## Relevant Files

| File                                                | Change                        |
| --------------------------------------------------- | ----------------------------- |
| `dotnet/Backend/Models/Location.cs`                 | NEW                           |
| `dotnet/Backend/Models/ShowLore.cs`                 | NEW                           |
| `dotnet/Backend/Controllers/LocationsController.cs` | NEW (GET list, GET {id})      |
| `dotnet/Backend/Controllers/ShowLoreController.cs`  | NEW (GET list, GET {id})      |
| `dotnet/Backend/Data/FanHubContext.cs`              | Add 2 DbSets                  |
| `dotnet/Backend/Data/SeedData.cs`                   | Add Location + ShowLore seeds |
| `dotnet/Frontend/Components/Pages/Home.razor`       | Stat cards + form panel + CSS |
| `dotnet/Frontend/wwwroot/js/animations.js`          | NEW                           |
| `dotnet/Frontend/Components/App.razor`              | Add script tag                |

---

## Verification

1. `cd dotnet/Backend && dotnet build` — no compile errors
2. `dotnet ef migrations add AddLocationsAndShowLore && dotnet ef database update` — tables created
3. `GET /api/locations` → 8+ seeded objects
4. `GET /api/showlore` → 8+ seeded objects
5. Homepage shows "Universe at a Glance" with 3 animated cards on load
6. `cd dotnet/Backend.Tests && dotnet test` — existing tests still pass

---

## Decisions

- Stat cards only — no write UI; data managed via seed data
- Controllers are read-only (GET only) — no POST endpoints on Location or ShowLore
- No form state, no submit handler, no inline form model classes

## Exclusions

- No write endpoints (POST/PUT/DELETE) on Location or ShowLore
- No "Add to Universe" form
- No auth on any new endpoints
- Not fixing pre-existing intentional bugs as a side effect
