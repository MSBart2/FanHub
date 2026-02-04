# FanHub .NET - Known Bugs & Issues

> **Purpose**: This document catalogs intentional bugs, misconfigurations, and code quality issues in the FanHub .NET workshop project. These are designed for learning purposes - participants will fix them using AI-assisted development techniques.

**Language**: C# / .NET 10  
**Last Updated**: 2026-02-04  
**Total Bugs**: 62 documented (42 backend + 20 frontend)  
**Status**: Backend + Frontend complete

---

## 🔴 Critical Bugs

### 1. **Null Reference Exception in GetCharacter**
**Location**: `Backend/Controllers/CharactersController.cs` (line 30)  
**Type**: Runtime Exception  
**Impact**: Page-breaking

**Description**: 
- GetCharacter endpoint throws NullReferenceException when character ID doesn't exist
- No null check before accessing character properties
- Results in HTTP 500 instead of proper 404 response

**Evidence**:
```csharp
[HttpGet("{id}")]
public async Task<IActionResult> GetCharacter(int id)
{
    var character = await _context.Characters.FindAsync(id);
    return Ok(character.Name);  // BOOM if character is null!
}
```

**User Impact**: 
- API crashes with 500 error
- Poor error messages for clients
- Breaks frontend when character not found

**Workshop Learning**: Null checking, defensive programming, proper HTTP status codes

---

### 2. **Null Reference Exception in DeleteCharacter**
**Location**: `Backend/Controllers/CharactersController.cs` (line 62)  
**Type**: Runtime Exception  
**Impact**: Page-breaking

**Description**:
- DeleteCharacter attempts to remove null object from context
- No validation that character exists before deletion
- Throws ArgumentNullException from EF Core

**Evidence**:
```csharp
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteCharacter(int id)
{
    var character = await _context.Characters.FindAsync(id);
    _context.Characters.Remove(character);  // No null check!
    await _context.SaveChangesAsync();
    return NoContent();
}
```

**User Impact**: 
- DELETE /api/characters/999 crashes with 500 error
- Should return 404 Not Found

---

### 3. **Null Reference Exception in GetShow**
**Location**: `Backend/Controllers/ShowsController.cs` (line 28)  
**Type**: Runtime Exception  
**Impact**: Page-breaking

**Description**: Same pattern as GetCharacter - no null check

**Evidence**:
```csharp
[HttpGet("{id}")]
public async Task<IActionResult> GetShow(int id)
{
    var show = await _context.Shows.FindAsync(id);
    return Ok(show);  // No null check
}
```

---

### 4. **Null Reference Exception in DeleteShow**
**Location**: `Backend/Controllers/ShowsController.cs` (line 66)  
**Type**: Runtime Exception  
**Impact**: Page-breaking

**Evidence**:
```csharp
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteShow(int id)
{
    var show = await _context.Shows.FindAsync(id);
    _context.Shows.Remove(show);  // No null check
    await _context.SaveChangesAsync();
    return NoContent();
}
```

---

### 5. **MD5 Password Hashing - CRITICAL SECURITY VULNERABILITY**
**Location**: `Backend/Controllers/AuthController.cs` (line 93)  
**Type**: Security Vulnerability  
**Impact**: All user passwords compromised

**Description**:
- Using MD5 for password hashing - completely insecure!
- MD5 is cryptographically broken and fast to brute-force
- Rainbow tables can crack most MD5 passwords instantly
- Admin password "admin123" is MD5 hashed in seed data

**Evidence**:
```csharp
// BUG: Using insecure MD5 hashing
private string HashPasswordMD5(string password)
{
    using (MD5 md5 = MD5.Create())
    {
        byte[] inputBytes = Encoding.UTF8.GetBytes(password);
        byte[] hashBytes = md5.ComputeHash(inputBytes);
        // ...
    }
}
```

**Expected Behavior**: Use BCrypt, Argon2, or ASP.NET Core Identity's PasswordHasher  
**Workshop Learning**: Password security, cryptography basics, secure hashing algorithms

---

### 6. **Hardcoded Database Connection String**
**Location**: `Backend/Program.cs` (line 11)  
**Type**: Security/Configuration Bug  
**Impact**: Credentials exposed in source code

**Description**:
- Database credentials hardcoded directly in Program.cs
- Credentials would be committed to source control
- Comment even acknowledges it should use configuration!

**Evidence**:
```csharp
// BUG: Still hardcoded here instead of using configuration!
builder.Services.AddDbContext<FanHubContext>(options =>
    options.UseNpgsql("Host=localhost;Database=fanhub;Username=postgres;Password=postgres"));
```

**Expected Behavior**: 
```csharp
builder.Services.AddDbContext<FanHubContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
```

**Workshop Learning**: Configuration management, secrets handling, 12-factor app principles

---

### 7. **Duplicate Character Data in Seed File**
**Location**: `Backend/Data/SeedData.cs` (lines 94 and 128)  
**Type**: Data Integrity Bug  
**Impact**: Page-breaking

**Description**: 
- Jesse Pinkman appears TWICE in the characters seed data
- Same bug as Node.js version for consistency
- Quotes reference different Jesse IDs, splitting data

**Evidence**:
```csharp
new Character { Name = "Jesse Pinkman", ActorName = "Aaron Paul", ... },  // Index 1
// ... other characters ...
new Character { Name = "Jesse Pinkman", ActorName = "Aaron Paul", ... },  // Index 4 - DUPLICATE!
```

**User Impact**: 
- Characters page shows two Jesse Pinkman entries
- Quotes are split between the two records

**Workshop Learning**: Data validation, duplicate detection, database constraints

---

## ⚠️ High Priority Issues

### 8. **Missing Async/Await in UpdateCharacter**
**Location**: `Backend/Controllers/CharactersController.cs` (line 52)  
**Type**: Async Antipattern  
**Impact**: Data loss risk

**Description**:
- SaveChangesAsync() is called but not awaited
- Fire-and-forget pattern - method returns before save completes
- Could lose data if process terminates
- Also bad for testing and error handling

**Evidence**:
```csharp
[HttpPut("{id}")]
public Task<IActionResult> UpdateCharacter(int id, Character character)
{
    character.Id = id;
    _context.Entry(character).State = EntityState.Modified;
    _context.SaveChangesAsync();  // BUG: Not awaited!
    return Task.FromResult<IActionResult>(Ok(character));
}
```

**Expected Behavior**:
```csharp
[HttpPut("{id}")]
public async Task<IActionResult> UpdateCharacter(int id, Character character)
{
    character.Id = id;
    _context.Entry(character).State = EntityState.Modified;
    await _context.SaveChangesAsync();
    return Ok(character);
}
```

**Workshop Learning**: Async/await patterns, fire-and-forget dangers, task-based programming

---

### 9. **Missing Async/Await in UpdateShow**
**Location**: `Backend/Controllers/ShowsController.cs` (line 51)  
**Type**: Async Antipattern  
**Impact**: Data loss risk

**Description**: Same fire-and-forget pattern as UpdateCharacter

**Evidence**:
```csharp
[HttpPut("{id}")]
public Task<IActionResult> UpdateShow(int id, Show show)
{
    show.Id = id;
    _context.Entry(show).State = EntityState.Modified;
    _context.SaveChangesAsync();  // Not awaited!
    return Task.FromResult<IActionResult>(NoContent());
}
```

---

### 10. **No Error Handling in Controllers**
**Location**: Multiple controllers (Characters, Shows, Quotes)  
**Type**: Error Handling Gap  
**Impact**: Unhandled exceptions crash the API

**Description**:
- Most controller methods lack try/catch blocks
- Database errors bubble up as 500 errors
- No consistent error response format
- EpisodesController has error handling, but others don't - inconsistent!

**Example**:
```csharp
[HttpGet]
public async Task<IActionResult> GetCharacters()
{
    // No try/catch - database errors crash here
    var characters = await _context.Characters.ToListAsync();
    return Ok(characters);
}
```

**Expected Behavior**: 
- Add global exception filter, OR
- Add try/catch to each method with proper error responses

**Workshop Learning**: Exception handling strategies, global filters, middleware

---

### 11. **Stack Traces Exposed to Client**
**Location**: `Backend/Controllers/EpisodesController.cs` (line 30)  
**Type**: Security/Information Disclosure  
**Impact**: Reveals internal implementation details

**Description**:
- Catch block returns full exception message and stack trace to client
- Exposes internal paths, database schema, implementation details
- Should only return detailed errors in Development environment

**Evidence**:
```csharp
catch (Exception ex)
{
    // BUG: Exposing internal error details to client
    return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
}
```

**Expected Behavior**: Log full details, return generic message to client

---

### 12. **Missing Model Validation Attributes**
**Location**: `Backend/Models/*.cs` (all models)  
**Type**: Validation Gap  
**Impact**: Can create invalid data

**Description**:
- No `[Required]` attributes on required properties
- No `[MaxLength]` limits on string properties
- No `[EmailAddress]` validation on User.Email
- Can create shows with empty titles, characters with no names, etc.

**Examples**:
```csharp
// Character.cs
public string Name { get; set; }  // Should be [Required]
public string ActorName { get; set; }  // Should be [Required]

// User.cs
public string Email { get; set; }  // Should be [Required][EmailAddress]

// Show.cs
public string Title { get; set; }  // Should be [Required][MaxLength(200)]
```

**Workshop Learning**: Data Annotations, model validation, API contracts

---

### 13. **CORS Wide Open for All Origins**
**Location**: `Backend/Program.cs` (line 15)  
**Type**: Security Vulnerability  
**Impact**: Any website can access API

**Description**:
- CORS policy allows requests from any origin
- No restrictions on methods or headers
- Production security risk - allows cross-site attacks

**Evidence**:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin()  // BUG!
                         .AllowAnyMethod()
                         .AllowAnyHeader());
});
```

**Expected Behavior**: Restrict to specific origins in production

---

### 14. **Wrong HTTP Status Code on Create**
**Location**: `Backend/Controllers/CharactersController.cs` (line 42)  
**Type**: REST Convention Violation  
**Impact**: Incorrect API contract

**Description**:
- POST (create) operations should return 201 Created
- Currently returning 200 OK
- EpisodesController gets it RIGHT (201), others don't - inconsistent!

**Evidence**:
```csharp
[HttpPost]
public async Task<IActionResult> CreateCharacter(Character character)
{
    _context.Characters.Add(character);
    await _context.SaveChangesAsync();
    return Ok(character);  // Should be 201 Created!
}
```

**Expected Behavior**:
```csharp
return CreatedAtAction(nameof(GetCharacter), new { id = character.Id }, character);
```

---

### 15. **Weak Password Requirements**
**Location**: `Backend/Controllers/AuthController.cs` (line 31)  
**Type**: Security Bug  
**Impact**: Users can create easily cracked passwords

**Description**:
- Password only requires 6 characters minimum
- No complexity requirements (uppercase, numbers, symbols)
- Allows passwords like "123456" or "password"

**Evidence**:
```csharp
// BUG: Weak password requirements! Only checks length
if (request.Password.Length < 6)
{
    return BadRequest("Password must be at least 6 characters");
}
```

**Expected Behavior**: 
- Minimum 8-12 characters
- Require uppercase, lowercase, number, symbol

---

### 16. **No JWT Token Generation in Login**
**Location**: `Backend/Controllers/AuthController.cs` (line 76)  
**Type**: Implementation Gap  
**Impact**: No authentication mechanism

**Description**:
- Login endpoint validates credentials but doesn't generate JWT token
- Just returns user object - no way to authenticate subsequent requests
- Commented in code as missing feature

**Evidence**:
```csharp
if (user == null)
{
    return Unauthorized("Invalid email or password");
}

// BUG: No JWT token generation! Just returning user object
return Ok(new { message = "Login successful", user });
```

**Expected Behavior**: Generate and return JWT token

---

### 17. **Missing OnModelCreating in DbContext**
**Location**: `Backend/Data/FanHubContext.cs`  
**Type**: EF Core Configuration Gap  
**Impact**: No relationships configured

**Description**:
- DbContext has no OnModelCreating method
- Foreign key relationships not explicitly defined
- No cascading delete rules configured
- No indexes defined

**Evidence**: File is only 20 lines, no configuration

**Expected Behavior**: Add OnModelCreating with Fluent API configuration

---

### 18. **Auto-Seeding in Production**
**Location**: `Backend/Program.cs` (line 28)  
**Type**: Configuration Bug  
**Impact**: Seeds test data in production

**Description**:
- SeedData.Initialize() is called unconditionally
- Would seed test data (including duplicate Jesse bug) in production
- Should only seed in development environment

**Evidence**:
```csharp
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<FanHubContext>();
    // BUG: Auto-seeding in production is bad practice!
    SeedData.Initialize(context);
}
```

---

## 🟡 Medium Priority Issues

### 19. **N+1 Query Problem in GetCharacters**
**Location**: `Backend/Controllers/CharactersController.cs` (line 22)  
**Type**: Performance Issue  
**Impact**: Slow queries with many records

**Description**:
- Loading characters without including related Show entity
- If code accesses character.Show later, triggers separate query for each character
- Classic N+1 query antipattern

**Evidence**:
```csharp
[HttpGet]
public async Task<IActionResult> GetCharacters()
{
    var characters = await _context.Characters.ToListAsync();  // No .Include()
    return Ok(characters);
}
```

**Expected Behavior**:
```csharp
var characters = await _context.Characters
    .Include(c => c.Show)
    .ToListAsync();
```

---

### 20. **N+1 Query Problem in GetShows**
**Location**: `Backend/Controllers/ShowsController.cs` (line 21)  
**Type**: Performance Issue  
**Impact**: Slow queries

**Description**: Same N+1 issue - not including Characters or Episodes

---

### 21. **N+1 Query Problem in GetQuotes**
**Location**: `Backend/Controllers/QuotesController.cs` (line 18)  
**Type**: Performance Issue  
**Impact**: Character data will be null

**Description**:
- Quotes loaded without .Include(q => q.Character)
- Character navigation property will be null
- Frontend can't display character names

**Evidence**:
```csharp
[HttpGet]
public async Task<IActionResult> GetQuotes()
{
    // BUG: Missing Include() - Character property will be null
    var quotes = await _context.Quotes.ToListAsync();
    return Ok(quotes);
}
```

---

### 22. **N+1 Query in GetEpisodes with Season Filter**
**Location**: `Backend/Controllers/EpisodesController.cs` (line 23)  
**Type**: Performance Issue  
**Impact**: Season data not loaded

**Evidence**:
```csharp
if (season.HasValue)
{
    // BUG: Not using Include - Season property will be null
    query = query.Where(e => e.SeasonId == season.Value);
}
```

---

### 23. **Missing Navigation Properties in Show Model**
**Location**: `Backend/Models/Show.cs`  
**Type**: EF Core Design Issue  
**Impact**: Can't navigate to related entities

**Description**:
- Show has no Characters collection
- Show has no Episodes collection
- Show has no Seasons collection
- Makes queries verbose and error-prone

**Evidence**: Show.cs has no navigation properties at all

---

### 24. **Incomplete Navigation Properties in Character**
**Location**: `Backend/Models/Character.cs`  
**Type**: EF Core Design Issue  
**Impact**: Missing relationships

**Description**:
- Has `Show` navigation property (good)
- Missing `virtual` keyword (lazy loading won't work)
- Missing `Quotes` collection
- Missing `Episodes` collection (if using many-to-many)

**Evidence**:
```csharp
public Show Show { get; set; }  // Should be: public virtual Show Show { get; set; }
// Missing: public virtual ICollection<Quote> Quotes { get; set; }
```

---

### 25. **Missing Navigation Properties in Episode**
**Location**: `Backend/Models/Episode.cs`  
**Type**: EF Core Design Issue  

**Description**:
- Has Season navigation
- Missing Show navigation
- Missing Quotes collection

---

### 26. **All Navigation Properties Missing in Season**
**Location**: `Backend/Models/Season.cs`  
**Type**: EF Core Design Issue  

**Description**:
- No navigation properties at all
- Should have Show and Episodes collection

---

### 27. **Partial Navigation Properties in Quote**
**Location**: `Backend/Models/Quote.cs`  
**Type**: EF Core Design Issue  

**Description**:
- Has Character navigation
- Missing Show navigation
- Missing Episode navigation

---

### 28. **Status as String Instead of Enum**
**Location**: `Backend/Models/Character.cs` (line 12)  
**Type**: Type Safety Issue  
**Impact**: Can store invalid values

**Description**:
- Status is a string - can be anything
- Should be enum: Alive, Deceased, Unknown
- Same issue in Node.js version

**Evidence**:
```csharp
public string Status { get; set; }  // BUG: Should be enum
```

**Expected Behavior**:
```csharp
public CharacterStatus Status { get; set; }

public enum CharacterStatus
{
    Alive,
    Deceased,
    Unknown
}
```

---

### 29. **Role as String Instead of Enum**
**Location**: `Backend/Models/User.cs` (line 10)  
**Type**: Type Safety Issue  

**Description**: Same issue as Status - role should be enum (Admin, User, Moderator)

---

### 30. **Inconsistent Response Formats**
**Location**: Multiple controllers  
**Type**: API Design Bug  
**Impact**: Difficult for frontend to handle

**Description**:
- CharactersController: Returns raw arrays/objects
- ShowsController: Returns raw arrays/objects
- EpisodesController: Returns `{ success: true, count: X, data: [...] }`
- QuotesController: Returns raw arrays/objects
- No consistent wrapping strategy

**Example**:
```csharp
// EpisodesController
return Ok(new { success = true, count = episodes.Count, data = episodes });

// Other controllers
return Ok(characters);  // Different format!
```

---

### 31. **Race Condition in Quote Likes**
**Location**: `Backend/Controllers/QuotesController.cs` (line 36)  
**Type**: Concurrency Bug  
**Impact**: Lost like counts

**Description**:
- Multiple simultaneous like requests can increment the same value
- Classic read-modify-write race condition
- Lost updates in concurrent scenarios

**Evidence**:
```csharp
[HttpPost("{id}/like")]
public async Task<IActionResult> LikeQuote(int id)
{
    var quote = await _context.Quotes.FindAsync(id);
    if (quote == null) return NotFound();
    
    // BUG: Race condition! Multiple requests can increment at same time
    quote.Likes++;
    await _context.SaveChangesAsync();
    return Ok(quote);
}
```

**Expected Behavior**: Use optimistic concurrency or atomic SQL update

---

### 32. **UseHttpsRedirection with --no-https**
**Location**: `Backend/Program.cs` (line 37)  
**Type**: Configuration Mismatch  
**Impact**: Middleware may not work as expected

**Description**:
- Project created with --no-https flag
- But UseHttpsRedirection() is still in pipeline
- Should be removed or HTTPS properly configured

**Evidence**:
```csharp
// BUG: UseHttpsRedirection but we created with --no-https
app.UseHttpsRedirection();
```

---

### 33. **Missing DELETE Endpoint in QuotesController**
**Location**: `Backend/Controllers/QuotesController.cs`  
**Type**: Implementation Gap  
**Impact**: No way to delete quotes via API

**Description**:
- QuotesController has GET and POST
- Has custom /like endpoint
- But DELETE endpoint completely missing!
- Commented in code as missing

**Evidence**: No [HttpDelete] method exists

---

### 34. **No Pagination on List Endpoints**
**Location**: All GET list endpoints  
**Type**: Performance/UX Issue  
**Impact**: Returns all records at once

**Description**:
- GetCharacters, GetShows, GetEpisodes, GetQuotes all return full lists
- No skip/take parameters
- Could return thousands of records
- Performance and bandwidth waste

---

## 🟢 Low Priority / Code Quality Issues

### 35. **Missing [FromBody] Attribute**
**Location**: `Backend/Controllers/ShowsController.cs` (line 37)  
**Type**: Code Quality  

**Description**:
- CreateShow parameter lacks [FromBody] attribute
- Works due to inference but explicit is better
- Other controllers use [FromBody] - inconsistent

**Evidence**:
```csharp
[HttpPost]
public async Task<IActionResult> CreateShow(Show show)  // Should be [FromBody] Show show
```

---

### 36. **Non-readonly Field in EpisodesController**
**Location**: `Backend/Controllers/EpisodesController.cs` (line 11)  
**Type**: Code Quality  

**Description**:
- `_context` field is not readonly
- All other controllers use readonly
- Inconsistent pattern

**Evidence**:
```csharp
private FanHubContext _context;  // Should be: private readonly FanHubContext _context;
```

---

### 37. **Inconsistent Error Response Format in Episodes**
**Location**: `Backend/Controllers/EpisodesController.cs` (line 42)  
**Type**: API Consistency  

**Description**:
- Returns `{ message: "...", code: "EPISODE_NOT_FOUND" }`
- Other controllers just return plain string or don't check null
- No consistent error format across API

---

### 38. **Password Hash Returned to Client**
**Location**: `Backend/Controllers/AuthController.cs` (line 51)  
**Type**: Security/Information Disclosure  

**Description**:
- Register endpoint returns full User object including PasswordHash
- Even though MD5, shouldn't return hashes to client

**Evidence**:
```csharp
var user = new User { /* ... */ };
_context.Users.Add(user);
await _context.SaveChangesAsync();

// BUG: Returning password hash to client!
return Ok(user);
```

---

### 39. **Request Models in Controller File**
**Location**: `Backend/Controllers/AuthController.cs` (lines 104-116)  
**Type**: Code Organization  

**Description**:
- RegisterRequest and LoginRequest classes defined at bottom of controller
- Should be in separate Models/Requests/ folder
- Poor separation of concerns

---

### 40. **29 Compiler Warnings (CS8618)**
**Location**: All model classes  
**Type**: Nullable Reference Type Warnings  
**Impact**: Build warnings

**Description**:
- Non-nullable properties don't have required modifier or default values
- .NET 10 nullable reference types feature
- All properties should have `required` keyword or be nullable

**Examples**:
```csharp
public string Name { get; set; }  // Warning CS8618
// Should be:
public required string Name { get; set; }  // OR: public string? Name { get; set; }
```

---

### 41. **Revealing Whether Email Exists in Login**
**Location**: `Backend/Controllers/AuthController.cs` (line 73)  
**Type**: Security - Information Disclosure  

**Description**:
- Error message "Invalid email or password" is generic (good!)
- But code logic could still reveal timing differences
- Vulnerable to email enumeration via timing attacks

---

### 42. **No Validation on Auth Endpoints**
**Location**: `Backend/Controllers/AuthController.cs`  
**Type**: Validation Gap  

**Description**:
- Register and Login endpoints have no [Required] validation
- Can call with null email/password
- Should validate before processing

---

## 📊 Summary by Category

| Category | Count | Examples |
|----------|-------|----------|
| **Null Reference Exceptions** | 4 | GetCharacter, DeleteCharacter, GetShow, DeleteShow |
| **Security Vulnerabilities** | 7 | MD5 hashing, CORS, hardcoded secrets, stack traces, password hash returned |
| **Async/Await Antipatterns** | 2 | UpdateCharacter, UpdateShow not awaited |
| **Missing Validation** | 3 | No [Required], weak passwords, no auth validation |
| **EF Core Design** | 7 | Missing/incomplete navigation properties |
| **Type Safety** | 2 | Status/Role as strings |
| **REST Conventions** | 2 | Wrong status codes, missing DELETE |
| **Error Handling** | 2 | No try/catch, exposed stack traces |
| **Performance** | 5 | N+1 queries, no pagination |
| **Configuration** | 3 | Hardcoded strings, auto-seeding, HTTPS mismatch |
| **API Consistency** | 3 | Different response formats, error formats |
| **Concurrency** | 1 | Race condition in likes |
| **Code Quality** | 5 | Nullable warnings, organization, readonly |
| **TOTAL** | **42** | **Backend only** |

---

## 🎯 Workshop Learning Objectives

This C# version teaches:

### Backend Skills Covered
✅ Null safety and defensive programming  
✅ Async/await patterns and antipatterns  
✅ Model validation with Data Annotations  
✅ EF Core navigation properties and relationships  
✅ Configuration management and secrets  
✅ CORS and API security  
✅ HTTP status codes and REST conventions  
✅ Error handling strategies and middleware  
✅ Type safety with enums vs strings  
✅ Performance optimization (N+1 queries, pagination)  
✅ Password security and cryptography  
✅ Concurrency and race conditions  

### Still To Add (Frontend)
⏳ Blazor component lifecycle bugs  
⏳ StateHasChanged misuse  
⏳ Event handler memory leaks (@implements IDisposable)  
⏳ Parameter binding issues ([Parameter] attribute)  
⏳ CSS isolation problems  
⏳ JS Interop issues  
⏳ Cascade parameter bugs

---

## 🔍 Detection Tips for Workshop Participants

**To find these bugs:**
1. Run the application and test each endpoint
2. Try edge cases (null IDs, missing data, invalid inputs)
3. Use .NET analyzers and code analysis
4. Search for TODO/BUG comments
5. Review compiler warnings (29 CS8618 warnings!)
6. Test concurrent scenarios (like endpoint race condition)
7. Check network responses for consistency
8. Review security headers and CORS policy

**AI assistance can help:**
- "Find null reference vulnerabilities in controllers"
- "Scan for async/await antipatterns"
- "Identify missing validation attributes"
- "Find N+1 query problems"
- "Suggest EF Core navigation property improvements"
- "Review password security implementation"

---

## 🎨 FRONTEND (BLAZOR) BUGS

---

## 🔴 Critical Bugs (Frontend)

### 43. **Null Reference Exception in Home Page Quote Display**
**Location**: `Frontend/Components/Pages/Home.razor` (line 19)  
**Type**: Runtime Exception  
**Impact**: Page crashes on load

**Description**:
- Quote display doesn't check if randomQuote is null
- After isLoading is false, randomQuote might still be null if API call failed
- Accessing Character.Name without null check on navigation property

**Evidence**:
```razor
@* BUG: Will crash if randomQuote is null *@
<blockquote>
    <p>"@randomQuote.QuoteText"</p>
    @* BUG: Character navigation property will be null (N+1 bug from backend) *@
    <footer>— @randomQuote.Character.Name</footer>
</blockquote>
```

**User Impact**: 
- NullReferenceException if API fails silently
- Character.Name will be null due to backend N+1 bug

**Workshop Learning**: Null-conditional operators (?.), null checks in Blazor markup

---

### 44. **Substring Without Bounds Check in Characters Page**
**Location**: `Frontend/Components/Pages/Characters.razor` (line 23)  
**Type**: Runtime Exception  
**Impact**: Page crashes when Bio is short

**Description**:
- Bio.Substring(0, 100) called without checking if Bio has 100 characters
- Will throw ArgumentOutOfRangeException if Bio is less than 100 characters

**Evidence**:
```razor
@foreach (var character in characters)
{
    <div class="character-card">
        @* BUG: No null check on Bio before calling Substring *@
        <p class="bio">@character.Bio.Substring(0, 100)...</p>
    </div>
}
```

**Expected Behavior**:
```razor
<p class="bio">@(character.Bio?.Length > 100 ? character.Bio.Substring(0, 100) + "..." : character.Bio)</p>
```

**Workshop Learning**: String manipulation safety, null-conditional operators

---

### 45. **Memory Leak from Unsubscribed Event Handler**
**Location**: `Frontend/Components/Pages/Characters.razor` (lines 42-95)  
**Type**: Memory Leak  
**Impact**: Memory grows unbounded with navigation

**Description**:
- Static event `OnCharacterSelected` is subscribed to in OnInitializedAsync
- Component does NOT implement IDisposable
- Event handler is NEVER unsubscribed
- Each page navigation creates a new component instance with a new subscription
- Old component instances can't be garbage collected (event holds reference)

**Evidence**:
```csharp
// BUG: Event not unsubscribed - memory leak!
private static event EventHandler<Character>? OnCharacterSelected;

protected override async Task OnInitializedAsync()
{
    // BUG: Subscribing to static event without cleanup
    OnCharacterSelected += HandleCharacterSelected;
    
    await LoadCharacters();
}

// BUG: NOT implementing IDisposable!
// Should unsubscribe from OnCharacterSelected
```

**Expected Behavior**:
```csharp
@implements IDisposable

public void Dispose()
{
    OnCharacterSelected -= HandleCharacterSelected;
}
```

**User Impact**: 
- Memory usage grows with each navigation to Characters page
- Multiple event handlers fire for same event
- Application slows down over time

**Workshop Learning**: IDisposable pattern, event handler cleanup, Blazor component lifecycle

---

### 46. **HttpClient Not Configured with Base Address**
**Location**: `Frontend/Program.cs` (line 9)  
**Type**: Configuration Bug  
**Impact**: All API calls fail

**Description**:
- HttpClient registered without base address configuration
- All API calls use full hardcoded URLs
- Makes configuration changes difficult
- Comment in code acknowledges the bug

**Evidence**:
```csharp
// BUG: HttpClient not configured with base address!
// Should be: builder.Services.AddHttpClient(client => client.BaseAddress = new Uri("http://localhost:5000"));
builder.Services.AddHttpClient();
```

**Expected Behavior**: Configure base address, then use relative URLs in components

**Workshop Learning**: HttpClient configuration, dependency injection

---

## ⚠️ High Priority Issues (Frontend)

### 47. **StateHasChanged Called Before Async Operation**
**Location**: `Frontend/Components/Pages/Home.razor` (line 39)  
**Type**: Performance Bug  
**Impact**: Unnecessary re-render

**Description**:
- StateHasChanged() called BEFORE async operations
- Blazor will automatically trigger re-render after async completes
- Completely unnecessary call - wastes CPU cycles

**Evidence**:
```csharp
protected override async Task OnInitializedAsync()
{
    // BUG: StateHasChanged called before async operation (unnecessary)
    StateHasChanged();
    
    await LoadRandomQuote();
    await LoadStats();
    
    isLoading = false;
    
    // BUG: StateHasChanged called after async (redundant - automatic)
    StateHasChanged();
}
```

**Expected Behavior**: Remove both StateHasChanged calls - Blazor handles it

**Workshop Learning**: Blazor rendering lifecycle, when StateHasChanged is needed

---

### 48. **StateHasChanged Called After Async (Redundant)**
**Location**: Multiple pages (Home, Episodes, Characters)  
**Type**: Performance Bug  
**Impact**: Unnecessary re-renders

**Description**:
- StateHasChanged() called after async method completes
- Blazor AUTOMATICALLY calls StateHasChanged after async lifecycle methods
- Found in OnInitializedAsync, button click handlers, and change events

**Examples**:
```csharp
// Home.razor
isLoading = false;
StateHasChanged();  // Redundant!

// Episodes.razor (line 69)
await LoadEpisodes();
StateHasChanged();  // Redundant!

// Characters.razor (line 87)
selectedCharacter = character;
StateHasChanged();  // Unnecessary!
```

**Workshop Learning**: Blazor automatic rendering, performance optimization

---

### 49. **Silent Exception Swallowing**
**Location**: Multiple pages (Home.razor lines 49-59, Characters.razor line 78)  
**Type**: Error Handling Gap  
**Impact**: User gets no feedback on failures

**Description**:
- Try/catch blocks with empty catch clauses
- API failures are completely silent
- User sees loading state forever or blank sections
- No logging, no user notification

**Evidence**:
```csharp
private async Task LoadRandomQuote()
{
    try
    {
        var quotes = await Http.GetFromJsonAsync<Quote[]>("http://localhost:5000/api/quotes");
        var random = new Random();
        randomQuote = quotes[random.Next(quotes.Length)];
    }
    catch
    {
        // BUG: Swallowing exception, user gets no feedback
    }
}
```

**Expected Behavior**: Log error, show user-friendly message, set error state

---

### 50. **Hardcoded API URLs Everywhere**
**Location**: All pages (Home, Characters, Episodes)  
**Type**: Configuration Bug  
**Impact**: Difficult to change environments

**Description**:
- Every API call uses hardcoded `http://localhost:5000`
- No configuration file or settings
- Can't easily switch between dev/staging/production
- Violates DRY principle

**Examples**:
```csharp
// Home.razor
var quotes = await Http.GetFromJsonAsync<Quote[]>("http://localhost:5000/api/quotes");
var characters = await Http.GetFromJsonAsync<Character[]>("http://localhost:5000/api/characters");

// Characters.razor
characters = await Http.GetFromJsonAsync<Character[]>("http://localhost:5000/api/characters");

// Episodes.razor
var url = "http://localhost:5000/api/episodes";
```

**Expected Behavior**: Use appsettings.json or configure HttpClient base address

---

### 51. **Episode Cache Ignores Season Filter**
**Location**: `Frontend/Components/Pages/Episodes.razor` (lines 73-79)  
**Type**: Logic Bug  
**Impact**: Filter appears broken

**Description**:
- Cache stores ALL episodes without considering season filter
- When user selects Season 2, might see Season 1 from cache
- Same bug as Node.js version! (intentional for workshop consistency)

**Evidence**:
```csharp
// BUG: Cache ignores season filter! (Same as Node.js bug)
if (cachedEpisodes != null)
{
    episodes = cachedEpisodes;
    isLoading = false;
    return;  // Returns ALL episodes even if season filter selected!
}
```

**User Impact**:
- Season filter doesn't work reliably
- User confusion - clicked Season 2 but sees Season 1

**Workshop Learning**: Caching strategies, cache key design

---

### 52. **No Null Check on API Response Arrays**
**Location**: Home.razor (lines 53, 62-65)  
**Type**: Null Safety Bug  
**Impact**: NullReferenceException

**Description**:
- API responses assumed to be non-null
- No validation that arrays have data before accessing
- Will crash if backend returns null

**Evidence**:
```csharp
var quotes = await Http.GetFromJsonAsync<Quote[]>("http://localhost:5000/api/quotes");
// BUG: No null check on quotes array
var random = new Random();
randomQuote = quotes[random.Next(quotes.Length)];  // Crash if quotes is null!

// LoadStats
characterCount = characters.Length;  // No null check
episodeCount = episodes.Length;  // No null check
```

---

### 53. **Optimistic Update Without Response Validation**
**Location**: `Frontend/Components/Pages/Home.razor` (line 75)  
**Type**: Data Consistency Bug  
**Impact**: UI shows wrong data

**Description**:
- LikeQuote increments likes count immediately
- Doesn't check if API call succeeded
- If API fails, UI shows wrong count
- No rollback on failure

**Evidence**:
```csharp
private async Task LikeQuote()
{
    await Http.PostAsync($"http://localhost:5000/api/quotes/{randomQuote.Id}/like", null);
    
    // BUG: Optimistic update without checking response
    randomQuote.Likes++;
    
    StateHasChanged();  // Also unnecessary!
}
```

**Expected Behavior**: Check response, only update on success

---

## 🟡 Medium Priority Issues (Frontend)

### 54. **Models Defined Inside Razor Pages**
**Location**: All pages (Home, Characters, Episodes)  
**Type**: Code Organization  
**Impact**: Code duplication, poor maintainability

**Description**:
- Each page defines its own model classes
- Quote, Character, Episode defined multiple times
- Should be in separate `Models/` folder
- Violates DRY and single responsibility

**Evidence**:
```csharp
// Home.razor - defines Quote, Character, Episode
public class Quote { ... }
public class Character { ... }
public class Episode { ... }

// Characters.razor - defines Character again (duplicate!)
public class Character { ... }

// Episodes.razor - defines Episode and EpisodeResponse
public class Episode { ... }
public class EpisodeResponse { ... }
```

**Workshop Learning**: Code organization, separation of concerns

---

### 55. **Using Style Tags Instead of CSS Isolation**
**Location**: All pages and components  
**Type**: CSS Architecture Bug  
**Impact**: Global style pollution

**Description**:
- All components use `<style>` tags for CSS
- Blazor supports CSS isolation (.razor.css files)
- Styles are global and can conflict
- No scoping mechanism

**Examples**:
```razor
<!-- Home.razor -->
<style>
    /* BUG: Using <style> tag instead of CSS isolation! */
    .home-container { ... }
</style>

<!-- NavBar.razor -->
<style>
    /* BUG: Global CSS in component instead of isolated styles! */
    .navbar { ... }
</style>
```

**Expected Behavior**: Use `Home.razor.css` for scoped styles

---

### 56. **Conflicting Navigation Components**
**Location**: `Frontend/Components/Layout/MainLayout.razor`  
**Type**: Component Design Bug  
**Impact**: Confusion, unused code

**Description**:
- Created custom NavBar component
- Didn't remove default NavMenu component
- Comment acknowledges the conflict
- NavMenu still exists but not used

**Evidence**:
```razor
@inherits LayoutComponentBase

<!-- BUG: Using custom NavBar but didn't remove NavMenu - conflicting components -->
<NavBar />
```

**Expected Behavior**: Remove NavMenu.razor and related files

---

### 57. **No Service Layer for API Calls**
**Location**: All pages  
**Type**: Architecture Gap  
**Impact**: Code duplication, difficult testing

**Description**:
- Each page makes direct HttpClient calls
- No abstraction or service layer
- Hard to mock for testing
- API logic spread across components

**Expected Behavior**: Create CharactersService, QuotesService, EpisodesService

---

### 58. **Wrong Query Parameter Name**
**Location**: `Frontend/Components/Pages/Episodes.razor` (line 92)  
**Type**: API Inconsistency  
**Impact**: Filter might not work

**Description**:
- Frontend uses `?season={id}` query parameter
- Backend expects `?season={id}` (actually matches, but comment suggests mismatch)
- Inconsistency risk across environments

**Evidence**:
```csharp
if (selectedSeason.HasValue)
{
    // BUG: Wrong query parameter name (should match backend)
    url += $"?season={selectedSeason.Value}";
}
```

---

### 59. **Inconsistent Response Model Handling**
**Location**: `Frontend/Components/Pages/Episodes.razor` (lines 107-114)  
**Type**: API Consistency Bug  
**Impact**: Requires different code per endpoint

**Description**:
- EpisodesController returns wrapped response: `{ success, count, data }`
- Other controllers return raw arrays
- Frontend must handle both formats
- Backend inconsistency reflected in frontend

**Evidence**:
```csharp
// BUG: Response model doesn't match backend inconsistency
// Episodes controller returns { success, count, data }
// But other controllers return raw arrays
public class EpisodeResponse
{
    public bool Success { get; set; }
    public int Count { get; set; }
    public Episode[] Data { get; set; }
}

var response = await Http.GetFromJsonAsync<EpisodeResponse>(url);
episodes = response?.Data;  // Have to unwrap
```

---

### 60. **No Loading State for Stats Section**
**Location**: `Frontend/Components/Pages/Home.razor` (lines 28-31)  
**Type**: UX Bug  
**Impact**: Shows 0 counts initially

**Description**:
- Stats section shows immediately with default values (0)
- No "Loading..." state
- Looks like there's no data

**Evidence**:
```razor
<div class="stats-section">
    <h2>Site Statistics</h2>
    @* BUG: These will be null initially, no loading state *@
    <p>Total Characters: @characterCount</p>
    <p>Total Episodes: @episodeCount</p>
</div>
```

---

### 61. **Static Event Shared Across Component Instances**
**Location**: `Frontend/Components/Pages/Characters.razor` (line 42)  
**Type**: Component Design Bug  
**Impact**: Multiple components react to same event

**Description**:
- `OnCharacterSelected` is a static event
- Shared across ALL Characters component instances
- Multiple instances will ALL handle the same event
- Intended behavior unclear

**Evidence**:
```csharp
// BUG: Event not unsubscribed - memory leak!
private static event EventHandler<Character>? OnCharacterSelected;

private void HandleCharacterSelected(object? sender, Character character)
{
    // BUG: This will cause multiple components to react
    Console.WriteLine($"Character selected: {character.Name}");
}
```

---

### 62. **DateTime Formatting Without Null Check**
**Location**: `Frontend/Components/Pages/Episodes.razor` (line 56)  
**Type**: Potential Bug  
**Impact**: Could crash on invalid data

**Description**:
- AirDate.ToString() called without checking if AirDate is valid
- Assumes backend always returns valid DateTime

**Evidence**:
```razor
@* BUG: No null check before formatting date *@
<p class="air-date">Aired: @episode.AirDate.ToString("MMM dd, yyyy")</p>
```

---

## 🟢 Low Priority / Code Quality Issues (Frontend)

### 63. **Console.WriteLine for Logging**
**Location**: `Frontend/Components/Pages/Characters.razor` (line 93)  
**Type**: Code Quality  
**Impact**: Poor logging practices

**Description**:
- Using Console.WriteLine instead of proper logging
- Logs not structured or filterable
- Should use ILogger

**Evidence**:
```csharp
private void HandleCharacterSelected(object? sender, Character character)
{
    Console.WriteLine($"Character selected: {character.Name}");
}
```

---

### 64. **Mixing Styles in MainLayout**
**Location**: `Frontend/Components/Layout/MainLayout.razor` (line 19)  
**Type**: Code Quality  
**Impact**: Inconsistent styling approach

**Description**:
- MainLayout uses inline `<style>` tag
- Should use MainLayout.razor.css (which already exists!)
- Inconsistent with component CSS patterns

**Evidence**:
```razor
<style>
    /* BUG: Mixing global styles in layout instead of proper CSS architecture */
    .main-content { ... }
</style>
```

---

### 65. **No Component for Repeated Markup**
**Location**: `Frontend/Components/Pages/Characters.razor` (lines 18-26)  
**Type**: Code Quality  
**Impact**: Code duplication

**Description**:
- Character card markup repeated in foreach
- Should be extracted to CharacterCard.razor component
- Violates DRY principle

**Evidence**:
```razor
@foreach (var character in characters)
{
    @* BUG: Not using a component, duplicating markup *@
    <div class="character-card" @onclick="...">
        <h3>@character.Name</h3>
        <!-- ... repeated markup ... -->
    </div>
}
```

---

### 66. **7+ Compiler Warnings (CS8618)**
**Location**: All page model classes  
**Type**: Nullable Reference Type Warnings  
**Impact**: Build warnings

**Description**:
- Same as backend - non-nullable properties without required modifier
- Quote, Character, Episode models in pages
- All properties should be `required` or nullable

**Examples**:
```csharp
public class Character
{
    public string Name { get; set; }  // Warning CS8618
    // Should be: public required string Name { get; set; }
}
```

---

## 📊 Updated Summary by Category

| Category | Backend | Frontend | Total |
|----------|---------|----------|-------|
| **Null Reference Exceptions** | 4 | 3 | 7 |
| **Security Vulnerabilities** | 7 | 0 | 7 |
| **Async/Await Antipatterns** | 2 | 0 | 2 |
| **StateHasChanged Misuse** | 0 | 3 | 3 |
| **Memory Leaks** | 0 | 1 | 1 |
| **Missing Validation** | 3 | 2 | 5 |
| **EF Core Design** | 7 | 0 | 7 |
| **API Integration** | 0 | 4 | 4 |
| **CSS/Styling** | 0 | 3 | 3 |
| **Error Handling** | 2 | 1 | 3 |
| **Configuration** | 3 | 2 | 5 |
| **Code Organization** | 5 | 3 | 8 |
| **Performance** | 5 | 2 | 7 |
| **Type Safety** | 2 | 0 | 2 |
| **Other** | 2 | 3 | 5 |
| **TOTAL** | **42** | **24** | **66** |

---

## 🎯 Updated Workshop Learning Objectives

### Backend Skills Covered (.NET/EF Core)
✅ Null safety and defensive programming  
✅ Async/await patterns and antipatterns  
✅ Model validation with Data Annotations  
✅ EF Core navigation properties and relationships  
✅ Configuration management and secrets  
✅ CORS and API security  
✅ HTTP status codes and REST conventions  
✅ Error handling strategies and middleware  
✅ Type safety with enums vs strings  
✅ Performance optimization (N+1 queries, pagination)  
✅ Password security and cryptography  
✅ Concurrency and race conditions  

### Frontend Skills Covered (Blazor)
✅ Component lifecycle (OnInitializedAsync)  
✅ StateHasChanged usage and performance  
✅ IDisposable pattern for cleanup  
✅ Event handler memory leaks  
✅ Null safety in Blazor markup  
✅ HttpClient configuration and DI  
✅ CSS isolation vs global styles  
✅ Component architecture and reusability  
✅ Error handling and user feedback  
✅ Caching strategies  
✅ API response handling  

---

## 🔍 Updated Detection Tips

### Blazor-Specific Tips:
1. Look for StateHasChanged calls in async methods
2. Check for IDisposable implementation when subscribing to events
3. Examine markup for null-conditional operators (?.)
4. Review HttpClient usage patterns
5. Check for CSS isolation (.razor.css files)
6. Look for models defined in @code blocks
7. Test component with rapid navigation (memory leak detection)
8. Check browser DevTools for repeated API calls

**AI assistance can help with Blazor:**
- "Find components missing IDisposable"
- "Identify unnecessary StateHasChanged calls"
- "Check for null reference risks in markup"
- "Suggest CSS isolation improvements"
- "Find event handler memory leaks"

---

**Comparison with Node.js/React Version**: 

Both versions share:
- ✅ Duplicate Jesse Pinkman bug in seed data
- ✅ Episode cache ignoring filter
- ✅ Missing error handling
- ✅ Hardcoded configuration
- ✅ Similar UX patterns

C# version adds:
- ✅ Blazor-specific lifecycle bugs
- ✅ StateHasChanged misuse
- ✅ IDisposable memory leaks
- ✅ Component architecture issues

Node.js/React version has:
- ✅ useEffect dependency issues
- ✅ React Hook antipatterns  
- ✅ Class vs Functional component mixing

Both teach similar workshop objectives with language-appropriate bugs!

---

**Last Updated**: 2026-02-04  
**For**: FanHub .NET Workshop v0.1.0 (Proof-of-Concept)  
**Status**: ✅ Backend (42 bugs) + Frontend (24 bugs) = **66 TOTAL BUGS DOCUMENTED**
