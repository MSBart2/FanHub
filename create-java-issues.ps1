# Create GitHub Issues for Java Bugs
# This script creates 36 GitHub issues for the Java implementation bugs
# Run with: .\create-java-issues.ps1

$owner = "MSBart2"
$repo = "FanHub"

# GitHub CLI must be installed and authenticated
# Install: winget install GitHub.cli
# Auth: gh auth login

Write-Host "Creating 36 GitHub issues for Java bugs..." -ForegroundColor Green
Write-Host "Repository: $owner/$repo" -ForegroundColor Cyan
Write-Host ""

# First, create the lang:java label if it doesn't exist
Write-Host "Creating lang:java label..." -ForegroundColor Yellow
gh label create "lang:java" --repo "$owner/$repo" --color "FFA500" --description "Issues for Java/Spring Boot version" 2>$null

# Critical Bugs (3)
Write-Host "`n=== Creating Critical Bugs (3) ===" -ForegroundColor Red

gh issue create --repo "$owner/$repo" `
  --title "[Java] [CRITICAL] Duplicate character data causes UI to show two Jesse Pinkman entries" `
  --body "## Bug Description
Jesse Pinkman appears TWICE in the characters table with different IDs (2 and 5), causing duplicate entries in the UI and split data across records.

## Location
\`java/backend/src/main/resources/seed.sql\` (lines 36 and 39)

## Impact
🔴 **CRITICAL** - Page-breaking bug
- Characters page shows two Jesse Pinkman cards
- Character detail pages show incomplete data
- Quotes are split between two different character records

## Steps to Reproduce
1. Start the Java application: \`cd java && docker-compose up\`
2. Navigate to http://localhost:3002/characters
3. Observe two Jesse Pinkman cards displayed

## Fix Suggestion
Remove the duplicate entry on line 39 and update quote references to use the correct character_id.

For full details, see \`java/BUGS.md\` (Bug #1)" `
  --label "bug,lang:java,severity:critical"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [CRITICAL] Episode cache returns all episodes regardless of season filter" `
  --body "## Bug Description
The @Cacheable annotation doesn't include seasonId in the cache key, causing filtered requests to return cached unfiltered data.

## Location
\`java/backend/src/main/java/com/fanhub/service/EpisodeService.java\` (line 26)

## Impact
🔴 **CRITICAL** - Data display bug
- Season filter appears broken to users
- Clicking 'Season 2' might show Season 1 episodes from cache
- Cache returns ALL episodes regardless of filter parameter

## Code Evidence
\`\`\`java
// BUG: Cache key doesn't include seasonId parameter
@Cacheable(value = \"episodes\")
public List<Episode> getEpisodesBySeasonId(Long seasonId) {
    return episodeRepository.findBySeasonId(seasonId);
}
\`\`\`

## Steps to Reproduce
1. Load the Episodes page (loads all episodes)
2. Click 'Season 2' button
3. Observe that all episodes are still shown (cached data)
4. Wait 30 seconds (cache expires) and try again - now filtering works

## Fix Suggestion
Use \`@Cacheable(value = \"episodes\", key = \"#seasonId\")\` to include seasonId in cache key.

For full details, see \`java/BUGS.md\` (Bug #2)" `
  --label "bug,lang:java,severity:critical"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [CRITICAL] Auth routes use different path prefix than other API routes" `
  --body "## Bug Description
Most API controllers use /api/* prefix, but AuthController uses /auth (no /api prefix), creating API inconsistency.

## Location
\`java/backend/src/main/java/com/fanhub/controller/AuthController.java\` (line 16)

## Impact
🔴 **CRITICAL** - API Design Bug
- Developers must remember two different URL patterns
- API documentation is confusing
- Frontend code mixes paths (\`/api/characters\` vs \`/auth/login\`)

## Code Evidence
\`\`\`java
// Most controllers
@RequestMapping(\"/api/characters\")
@RequestMapping(\"/api/episodes\")
@RequestMapping(\"/api/shows\")

// AuthController - INCONSISTENT
@RequestMapping(\"/auth\")  // No /api prefix!
\`\`\`

## Fix Suggestion
Change AuthController to \`@RequestMapping(\"/api/auth\")\`

For full details, see \`java/BUGS.md\` (Bug #3)" `
  --label "bug,lang:java,severity:critical"

# High Priority Bugs (10)
Write-Host "`n=== Creating High Priority Bugs (10) ===" -ForegroundColor Yellow

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] Missing error handling in CharacterController" `
  --body "## Bug Description
CharacterController.getAllCharacters() has no try-catch block, exposing raw exceptions to clients.

## Location
\`java/backend/src/main/java/com/fanhub/controller/CharacterController.java\` (lines 22-32)

## Impact
⚠️ **HIGH** - Security and UX issue
- Database errors exposed to client
- Stack traces visible in production
- Poor user experience

## Fix Suggestion
Add @ControllerAdvice for global exception handling or wrap in try-catch.

For full details, see \`java/BUGS.md\` (Bug #4)" `
  --label "bug,lang:java,severity:high"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] Optional.get() called without isPresent() check" `
  --body "## Bug Description
CharacterService.getCharacterById() uses .get() without checking .isPresent(), causing NoSuchElementException.

## Location
\`java/backend/src/main/java/com/fanhub/service/CharacterService.java\` (line 24)

## Impact
⚠️ **HIGH** - Runtime exception risk
- Throws NoSuchElementException if character doesn't exist
- Common Java anti-pattern

## Code Evidence
\`\`\`java
public Character getCharacterById(Long id) {
    // BUG: No check if Optional is empty
    return characterRepository.findById(id).get();
}
\`\`\`

## Fix Suggestion
Use \`.orElseThrow(() -> new NotFoundException(...))\` or check \`.isPresent()\` first.

For full details, see \`java/BUGS.md\` (Bug #5)" `
  --label "bug,lang:java,severity:high"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] Mixed HTTP status codes for create operations" `
  --body "## Bug Description
POST endpoints return inconsistent status codes: CharacterController returns 200, ShowController returns 201.

## Location
Multiple controller files

## Impact
⚠️ **HIGH** - API consistency bug
- CharacterController.createCharacter(): Returns 200 (incorrect)
- ShowController.createShow(): Returns 201 (correct)
- EpisodeController.createEpisode(): Returns 201 (correct)

## Fix Suggestion
All POST (create) operations should return 201 Created.

For full details, see \`java/BUGS.md\` (Bug #6)" `
  --label "bug,lang:java,severity:high"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [SECURITY] Weak password requirements allow 6-character passwords" `
  --body "## Bug Description
AuthController only requires 6 characters minimum with no complexity requirements.

## Location
\`java/backend/src/main/java/com/fanhub/controller/AuthController.java\` (line 31)

## Impact
⚠️ **HIGH** - Security vulnerability
- Users can create weak passwords like '123456'
- No validation for complexity
- Security risk

## Code Evidence
\`\`\`java
if (password == null || password.length() < 6) {
    // Only 6 characters required!
}
\`\`\`

## Fix Suggestion
Require minimum 8 characters with complexity rules (uppercase, lowercase, number, special char).

For full details, see \`java/BUGS.md\` (Bug #7)" `
  --label "bug,lang:java,severity:high"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [SECURITY] CORS wide open for all origins" `
  --body "## Bug Description
CORS configured with \`origins = \"*\"\` on all controllers and in WebConfig.

## Location
Multiple files: All controllers + \`java/backend/src/main/java/com/fanhub/config/WebConfig.java\`

## Impact
⚠️ **HIGH** - Security misconfiguration
- Any origin can make requests
- CSRF vulnerability
- Should be restricted in production

## Fix Suggestion
Configure CORS to allow only specific origins, different for dev/prod environments.

For full details, see \`java/BUGS.md\` (Bug #8)" `
  --label "bug,lang:java,severity:high"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [SECURITY] Spring Security allows all requests without authentication" `
  --body "## Bug Description
SecurityConfig configured with \`.anyRequest().permitAll()\`, making all endpoints public.

## Location
\`java/backend/src/main/java/com/fanhub/config/SecurityConfig.java\` (line 18)

## Impact
⚠️ **HIGH** - Security vulnerability
- No authentication required
- All endpoints publicly accessible
- CSRF disabled

## Code Evidence
\`\`\`java
.authorizeHttpRequests(auth -> auth
    .anyRequest().permitAll()  // Everything is public!
);
\`\`\`

## Fix Suggestion
Configure proper authentication and restrict endpoints based on roles.

For full details, see \`java/BUGS.md\` (Bug #9)" `
  --label "bug,lang:java,severity:high"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [SECURITY] Exception messages exposed to client in production" `
  --body "## Bug Description
ShowController exposes exception details (\`e.getMessage()\`) to client in all environments.

## Location
\`java/backend/src/main/java/com/fanhub/controller/ShowController.java\` (line 38)

## Impact
⚠️ **HIGH** - Information disclosure
- Internal error details leaked
- Database structure exposed
- Security risk

## Fix Suggestion
Use generic error messages in production, detailed only in development.

For full details, see \`java/BUGS.md\` (Bug #10)" `
  --label "bug,lang:java,severity:high"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] No validation of required fields" `
  --body "## Bug Description
Service methods accept null parameters without validation, causing NullPointerException.

## Location
Multiple service classes

## Impact
⚠️ **HIGH** - Input validation gap
- CharacterService.searchCharacters(): No null check on query
- ShowService.createShow(): No validation that title is provided
- Runtime exceptions

## Fix Suggestion
Add Bean Validation annotations (@NotNull, @NotBlank) or manual null checks.

For full details, see \`java/BUGS.md\` (Bug #16)" `
  --label "bug,lang:java,severity:high"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] Incomplete JWT authentication implementation" `
  --body "## Bug Description
AuthController returns 'not_implemented' for JWT token, has no logout/refresh endpoints.

## Location
\`java/backend/src/main/java/com/fanhub/controller/AuthController.java\`

## Impact
⚠️ **HIGH** - Incomplete feature
- No JWT token generation
- No logout endpoint
- No token refresh
- No forgot password
- No email validation

## Code Evidence
\`\`\`java
response.put(\"token\", \"not_implemented\");  // TODO!
\`\`\`

## Fix Suggestion
Implement complete JWT authentication flow with token generation, validation, and refresh.

For full details, see \`java/BUGS.md\` (Bug #18)" `
  --label "bug,lang:java,severity:high"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] BCryptPasswordEncoder instantiated in controller instead of injected" `
  --body "## Bug Description
AuthController creates new BCryptPasswordEncoder instance instead of injecting the bean from SecurityConfig.

## Location
\`java/backend/src/main/java/com/fanhub/controller/AuthController.java\` (line 23)

## Impact
⚠️ **HIGH** - Design anti-pattern
- Creates new instance unnecessarily
- Bypasses Spring bean management
- Poor dependency injection practice

## Fix Suggestion
Inject PasswordEncoder bean from SecurityConfig via constructor injection.

For full details, see \`java/BUGS.md\` (Bug #19)" `
  --label "bug,lang:java,severity:high"

# Medium Priority Bugs (10)
Write-Host "`n=== Creating Medium Priority Bugs (10) ===" -ForegroundColor Cyan

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] Inconsistent Lombok usage across entity classes" `
  --body "## Bug Description
Entity classes use different Lombok approaches: @Data, @Getter/@Setter, and manual getters/setters.

## Location
Model classes in \`java/backend/src/main/java/com/fanhub/model/\`

## Impact
🟡 **MEDIUM** - Code inconsistency
- Character.java: Uses @Data
- Episode.java: Uses @Getter/@Setter
- Show.java: Manual getters/setters (no Lombok)
- User.java: Manual getters/setters

## Fix Suggestion
Standardize on one approach (preferably @Data) across all entities.

For full details, see \`java/BUGS.md\` (Bug #11)" `
  --label "bug,lang:java,severity:medium"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] Mixed dependency injection patterns" `
  --body "## Bug Description
Services use inconsistent dependency injection: some use field injection, others use constructor injection.

## Location
Service classes

## Impact
🟡 **MEDIUM** - Code inconsistency
- CharacterService: Field injection with @Autowired
- EpisodeService: Constructor injection (preferred)
- ShowService: Constructor injection
- QuoteService: Field injection

## Fix Suggestion
Use constructor injection everywhere (Spring Boot best practice).

For full details, see \`java/BUGS.md\` (Bug #12)" `
  --label "bug,lang:java,severity:medium"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] Inconsistent API response formats" `
  --body "## Bug Description
Different controllers return different response structures for similar operations.

## Location
Multiple controller files

## Impact
🟡 **MEDIUM** - API design inconsistency
- CharacterController: Returns raw List<Character>
- EpisodeController: Returns Map with {success, count, data}
- ShowController: Returns raw List for GET all, Map for errors
- QuoteController: Returns raw objects

## Fix Suggestion
Standardize on one response wrapper format across all endpoints.

For full details, see \`java/BUGS.md\` (Bug #13)" `
  --label "bug,lang:java,severity:medium"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] Mixed update methods (PUT vs PATCH)" `
  --body "## Bug Description
Controllers use different HTTP methods for updates: CharacterController uses PATCH, others use PUT.

## Location
Controller files

## Impact
🟡 **MEDIUM** - REST API inconsistency
- CharacterController: Uses @PatchMapping
- ShowController: Uses @PutMapping
- EpisodeController: Uses @PutMapping

## Fix Suggestion
Standardize on PUT for full updates, PATCH for partial updates (or choose one consistently).

For full details, see \`java/BUGS.md\` (Bug #14)" `
  --label "bug,lang:java,severity:medium"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] Missing @Repository annotations on some repositories" `
  --body "## Bug Description
Repository interfaces inconsistently use @Repository annotation.

## Location
Repository files

## Impact
🟡 **MEDIUM** - Code inconsistency
- ShowRepository: Has @Repository
- CharacterRepository: Missing @Repository
- EpisodeRepository: Has @Repository
- UserRepository: Missing @Repository

## Fix Suggestion
Add @Repository to all repository interfaces for consistency (though not strictly required with Spring Data JPA).

For full details, see \`java/BUGS.md\` (Bug #15)" `
  --label "bug,lang:java,severity:medium"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] Using Double instead of BigDecimal for rating field" `
  --body "## Bug Description
Episode.rating uses Double instead of BigDecimal, causing potential precision issues.

## Location
\`java/backend/src/main/java/com/fanhub/model/Episode.java\` (line 44)

## Impact
🟡 **MEDIUM** - Data precision bug
- Floating point arithmetic issues
- Loss of precision for decimal values
- BigDecimal is preferred for monetary/rating values

## Fix Suggestion
Change to \`private BigDecimal rating;\`

For full details, see \`java/BUGS.md\` (Bug #17)" `
  --label "bug,lang:java,severity:medium"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] No @Transactional annotations on service methods" `
  --body "## Bug Description
Service layer methods lack @Transactional annotations, risking data integrity issues.

## Location
All service classes

## Impact
🟡 **MEDIUM** - Data integrity risk
- Multi-step operations not atomic
- Could cause partial updates on errors
- Best practice violation

## Fix Suggestion
Add @Transactional to service methods that modify data.

For full details, see \`java/BUGS.md\` (Bug #20)" `
  --label "bug,lang:java,severity:medium"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] CharacterRepository.findByName assumes unique names" `
  --body "## Bug Description
findByName() returns single Character, but names aren't unique (duplicate Jesse Pinkman exists).

## Location
\`java/backend/src/main/java/com/fanhub/repository/CharacterRepository.java\` (line 12)

## Impact
🟡 **MEDIUM** - Design bug
- Returns only one Jesse when two exist
- Should return List<Character> or use unique constraint

## Fix Suggestion
Change return type to List<Character> or add unique constraint on name.

For full details, see \`java/BUGS.md\` (Bug #28)" `
  --label "bug,lang:java,severity:medium"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] No custom exception classes" `
  --body "## Bug Description
Code uses generic exceptions instead of custom domain-specific exceptions.

## Location
Entire codebase

## Impact
🟡 **MEDIUM** - Error handling gap
- Using generic exceptions
- No custom exception hierarchy
- Makes error handling inconsistent

## Fix Suggestion
Create custom exceptions (NotFoundException, ValidationException, etc.) with @ControllerAdvice.

For full details, see \`java/BUGS.md\` (Bug #29)" `
  --label "bug,lang:java,severity:medium"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [CONFIG] No environment-specific configuration files" `
  --body "## Bug Description
Only one application.properties file, no profile-specific properties for dev/prod.

## Location
\`java/backend/src/main/resources/\`

## Impact
🟡 **MEDIUM** - Configuration gap
- Dev and prod use same settings
- No application-dev.properties or application-prod.properties
- Can't easily switch configurations

## Fix Suggestion
Create application-dev.properties and application-prod.properties with environment-specific settings.

For full details, see \`java/BUGS.md\` (Bug #30)" `
  --label "bug,lang:java,severity:medium"

# Low Priority Bugs (8)
Write-Host "`n=== Creating Low Priority Bugs (8) ===" -ForegroundColor Gray

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] No pagination on list endpoints" `
  --body "## Bug Description
All findAll() calls return ALL records without pagination support.

## Location
All controller classes

## Impact
🟢 **LOW** - Performance/scalability gap
- Could cause performance issues with large datasets
- No page size limits
- Missing Pageable parameter

## Fix Suggestion
Add Pageable parameter and return Page<T> instead of List<T>.

For full details, see \`java/BUGS.md\` (Bug #21)" `
  --label "bug,lang:java,severity:low"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [CONFIG] Verbose logging enabled in production" `
  --body "## Bug Description
DEBUG level logging enabled by default, too verbose for production.

## Location
\`java/backend/src/main/resources/application.properties\` (lines 26-28)

## Impact
🟢 **LOW** - Configuration issue
- Excessive log output
- Performance impact
- SQL queries logged

## Fix Suggestion
Use INFO or WARN level in production, DEBUG only in development profile.

For full details, see \`java/BUGS.md\` (Bug #22)" `
  --label "bug,lang:java,severity:low"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [CONFIG] Using deprecated spring.sql.init properties" `
  --body "## Bug Description
Using deprecated \`spring.sql.init.*\` properties for SQL initialization.

## Location
\`java/backend/src/main/resources/application.properties\` (line 18)

## Impact
🟢 **LOW** - Configuration issue
- Deprecated approach
- Should use Flyway or Liquibase for production

## Fix Suggestion
Migrate to Flyway or Liquibase for database migrations.

For full details, see \`java/BUGS.md\` (Bug #23)" `
  --label "bug,lang:java,severity:low"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [SECURITY] Weak JWT secret in configuration" `
  --body "## Bug Description
JWT secret has weak default value and no production validation.

## Location
\`java/backend/src/main/resources/application.properties\` (line 24)

## Impact
🟢 **LOW** - Security risk
- Default secret is weak
- No check that it's changed in production
- Visible in configuration file

## Fix Suggestion
Require strong secret via environment variable, fail if not set in production.

For full details, see \`java/BUGS.md\` (Bug #24)" `
  --label "bug,lang:java,severity:low"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [SECURITY] Docker container runs as root user" `
  --body "## Bug Description
Dockerfile doesn't create non-root user, container runs as root.

## Location
\`java/backend/Dockerfile\`

## Impact
🟢 **LOW** - Security issue
- Container runs as root
- Security best practice violation

## Fix Suggestion
Create non-root user and switch to it before running application.

For full details, see \`java/BUGS.md\` (Bug #25)" `
  --label "bug,lang:java,severity:low"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] No request correlation IDs for logging" `
  --body "## Bug Description
No request correlation IDs configured, making debugging concurrent requests difficult.

## Location
No request logging configured

## Impact
🟢 **LOW** - Observability gap
- Can't trace requests through logs
- Debugging concurrent requests is hard

## Fix Suggestion
Add request ID filter/interceptor with MDC logging.

For full details, see \`java/BUGS.md\` (Bug #26)" `
  --label "bug,lang:java,severity:low"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] No Bean Validation annotations used" `
  --body "## Bug Description
Model and DTO classes don't use Bean Validation annotations (@NotNull, @Size, etc.).

## Location
Model and DTO classes

## Impact
🟢 **LOW** - Input validation gap
- Validation done manually in controllers (inconsistently)
- Missing standardized validation
- Should use @Valid with Bean Validation

## Fix Suggestion
Add Bean Validation annotations to models and use @Valid in controllers.

For full details, see \`java/BUGS.md\` (Bug #27)" `
  --label "bug,lang:java,severity:low"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [CONFIG] No profile-specific configuration" `
  --body "## Bug Description
Comment in application.properties says 'No profile-specific configuration' - same settings for all environments.

## Location
\`java/backend/src/main/resources/application.properties\`

## Impact
🟢 **LOW** - Configuration gap
- Dev and prod share configuration
- Can't easily override settings per environment

## Fix Suggestion
Create profile-specific property files and use Spring profiles.

For full details, see \`java/BUGS.md\` (Bug #31)" `
  --label "bug,lang:java,severity:low"

# Missing Features (3)
Write-Host "`n=== Creating Missing Feature Issues (3) ===" -ForegroundColor Magenta

gh issue create --repo "$owner/$repo" `
  --title "[Java] [TESTING] No tests configured" `
  --body "## Missing Feature
Test directory exists but is empty. No unit tests, integration tests, or test configuration.

## Location
\`java/backend/src/test/java/\`

## Impact
- No automated testing
- Can't verify bug fixes
- No regression testing

## What's Needed
- Unit tests for services (Mockito)
- Integration tests for controllers (Spring Boot Test)
- Repository tests
- Test configuration

For full details, see \`java/BUGS.md\` (Bug #33)" `
  --label "enhancement,lang:java,severity:low"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [DOCUMENTATION] No API documentation" `
  --body "## Missing Feature
No Swagger/OpenAPI configuration, no JavaDoc comments.

## Location
Entire codebase

## Impact
- API endpoints not documented
- No interactive API explorer
- Hard for developers to understand API

## What's Needed
- Swagger/OpenAPI configuration
- JavaDoc comments on public methods
- API usage examples

For full details, see \`java/BUGS.md\` (Bug #34)" `
  --label "documentation,lang:java,severity:low"

gh issue create --repo "$owner/$repo" `
  --title "[Java] [ARCHITECTURE] No DTO layer - controllers return entities directly" `
  --body "## Missing Feature
DTO directory exists but is empty. Controllers return JPA entities directly, exposing internal structure.

## Location
\`java/backend/src/main/java/com/fanhub/dto/\` (empty)

## Impact
- Security risk (exposes internal entity structure)
- Can't hide sensitive fields
- Tight coupling between API and database
- No versioning flexibility

## What's Needed
- Create DTO classes for API responses
- Use MapStruct or ModelMapper for mapping
- Keep entities internal to service layer

For full details, see \`java/BUGS.md\` (Bug #35)" `
  --label "enhancement,lang:java,severity:low"

Write-Host "`n✅ Successfully created 36 GitHub issues for Java bugs!" -ForegroundColor Green
Write-Host "View at: https://github.com/$owner/$repo/issues?q=is:issue+label:lang:java" -ForegroundColor Cyan
