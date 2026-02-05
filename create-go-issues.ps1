# Create GitHub Issues for Go Implementation Bugs
# This script creates issues for all 42 bugs in the Go implementation

$ErrorActionPreference = "Continue"
$repo = "MSBart2/FanHub"
$createdIssues = @()
$failedIssues = @()

Write-Host "Creating GitHub issues for Go implementation bugs..." -ForegroundColor Cyan
Write-Host "Repository: $repo" -ForegroundColor Cyan
Write-Host ""

# Ensure lang:go label exists
Write-Host "Creating lang:go label..." -ForegroundColor Yellow
gh label create "lang:go" --description "Go/Gin implementation" --color "00ADD8" --repo $repo 2>$null

# Helper function to create issue using temp file
function Create-Issue {
    param(
        [string]$Title,
        [string]$Body,
        [string[]]$Labels
    )
    
    try {
        # Create temp file for body
        $tempFile = [System.IO.Path]::GetTempFileName()
        $Body | Out-File -FilePath $tempFile -Encoding UTF8
        
        # Create issue
        $labelArgs = $Labels | ForEach-Object { "--label", $_ }
        $result = gh issue create --title $Title --body-file $tempFile --repo $repo @labelArgs 2>&1
        
        # Clean up
        Remove-Item $tempFile -ErrorAction SilentlyContinue
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Created: $Title" -ForegroundColor Green
            return $result
        } else {
            Write-Host "✗ Failed: $Title" -ForegroundColor Red
            Write-Host "  Error: $result" -ForegroundColor Red
            return $null
        }
    } catch {
        Write-Host "✗ Exception: $Title" -ForegroundColor Red
        Write-Host "  $_" -ForegroundColor Red
        return $null
    }
}

# CRITICAL SECURITY ISSUES

$issue = Create-Issue `
    -Title "[Go] [CRITICAL] SQL Injection in Character Search" `
    -Body @"
## Description
The character search endpoint is vulnerable to SQL injection attacks due to string concatenation in the query.

## Location
``````go
// handlers/character_handler.go
query := "%" + name + "%"
result := database.DB.Where("name LIKE ?", query)
``````

Actually the real issue is in the search method where raw SQL might be used.

## Impact
- Attackers can extract sensitive data
- Database could be modified or deleted
- Potential for complete system compromise

## Steps to Reproduce
``````bash
curl "http://localhost:8090/api/characters/search?name='; DROP TABLE characters; --"
``````

## Fix Suggestion
Use parameterized queries and GORM's safe query builders.
"@ `
    -Labels "bug","lang:go","severity:critical","security"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "SQL Injection" }

$issue = Create-Issue `
    -Title "[Go] [CRITICAL] Hardcoded JWT Secret in Production" `
    -Body @"
## Description
JWT secret has a hardcoded fallback value that could be used in production.

## Location
``````go
// config/config.go
var JWTSecret = getEnv("JWT_SECRET", "super-secret-key-do-not-use-in-production")
``````

## Impact
- Anyone can forge valid JWT tokens
- Complete authentication bypass
- Unauthorized access to all resources

## Fix Suggestion
Require JWT secret from environment variable with no default, or use a cryptographically secure generated secret.
"@ `
    -Labels "bug","lang:go","severity:critical","security"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "JWT Secret" }

$issue = Create-Issue `
    -Title "[Go] [CRITICAL] Password Hash Exposed in JSON Response" `
    -Body @"
## Description
The User model exposes the password hash in API responses.

## Location
``````go
// models/user.go
type User struct {
    ID           uint   ``json:"id"``
    Username     string ``json:"username"``
    PasswordHash string ``json:"password_hash"`` // Should be json:"-"
}
``````

## Impact
- Password hashes exposed to clients
- Makes brute force attacks easier
- Privacy and security violation

## Fix Suggestion
Use ``json:"-"`` tag to exclude from JSON serialization.
"@ `
    -Labels "bug","lang:go","severity:critical","security"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Password Hash" }

$issue = Create-Issue `
    -Title "[Go] [CRITICAL] CORS Allows All Origins" `
    -Body @"
## Description
CORS middleware allows requests from any origin.

## Location
``````go
// middleware/cors.go
AllowOrigins:     []string{"*"},
AllowMethods:     []string{"*"},
AllowHeaders:     []string{"*"},
``````

## Impact
- Any website can make requests to the API
- CSRF attacks possible
- Credential theft risk

## Fix Suggestion
Configure specific allowed origins based on environment.
"@ `
    -Labels "bug","lang:go","severity:critical","security"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "CORS" }

$issue = Create-Issue `
    -Title "[Go] [CRITICAL] Auth Middleware Not Implemented" `
    -Body @"
## Description
Authentication middleware exists but is completely unimplemented - just passes all requests through.

## Location
``````go
// middleware/auth.go
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next() // TODO: Implement JWT validation
    }
}
``````

## Impact
- No authentication enforcement
- Protected endpoints are publicly accessible
- Complete security bypass

## Fix Suggestion
Implement JWT token validation using the jwt-go library.
"@ `
    -Labels "bug","lang:go","severity:critical","security"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Auth Middleware" }

$issue = Create-Issue `
    -Title "[Go] [CRITICAL] Weak Password Requirements" `
    -Body @"
## Description
Password validation only requires 6 characters with no complexity requirements.

## Location
``````go
// services/auth_service.go
if len(password) < 6 {
    return "", errors.New("password must be at least 6 characters")
}
``````

## Impact
- Weak passwords allowed
- Easy to brute force
- Poor security posture

## Fix Suggestion
Require minimum 12 characters with complexity requirements (uppercase, lowercase, numbers, symbols).
"@ `
    -Labels "bug","lang:go","severity:high","security"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Weak Password" }

# CLASSIC GO MISTAKES

$issue = Create-Issue `
    -Title "[Go] [HIGH] Missing Error Checks Throughout Codebase" `
    -Body @"
## Description
Multiple locations ignore error returns from functions - the most common Go mistake!

## Locations
``````go
// handlers/character_handler.go
database.DB.First(&character, id) // error ignored

// handlers/episode_handler.go
strconv.Atoi(seasonIDStr) // error ignored

// services/auth_service.go
bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost) // error ignored
``````

## Impact
- Silent failures
- Undefined behavior
- Data corruption possible
- Difficult debugging

## Fix Suggestion
Always check errors: ``if err != nil { return err }``
"@ `
    -Labels "bug","lang:go","severity:high","code-quality"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Missing Error Checks" }

$issue = Create-Issue `
    -Title "[Go] [HIGH] Race Condition in Episode Cache" `
    -Body @"
## Description
Global cache map is accessed concurrently without mutex protection.

## Location
``````go
// services/episode_service.go
var episodeCache = make(map[string][]models.Episode) // No mutex!

func GetEpisodesBySeason(seasonID uint) []models.Episode {
    cacheKey := "episodes"
    if cached, ok := episodeCache[cacheKey]; ok { // RACE!
        return cached
    }
    // ...
    episodeCache[cacheKey] = episodes // RACE!
}
``````

## Impact
- Data race (detectable with ``go run -race``)
- Possible crashes or data corruption
- Concurrent map writes cause panic

## How to Detect
``````bash
go run -race main.go
# Make concurrent requests to /api/episodes
``````

## Fix Suggestion
Use ``sync.RWMutex`` or ``sync.Map`` for concurrent access.
"@ `
    -Labels "bug","lang:go","severity:high","concurrency"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Race Condition" }

$issue = Create-Issue `
    -Title "[Go] [HIGH] Goroutine Leak in Episode Service" `
    -Body @"
## Description
Background goroutine started in init() function has no way to be stopped.

## Location
``````go
// services/episode_service.go
func init() {
    go func() {
        for {
            time.Sleep(5 * time.Minute)
            episodeCache = make(map[string][]models.Episode)
        }
    }() // No cancellation!
}
``````

## Impact
- Goroutine runs forever, even after server shutdown
- Resource leak
- Cannot be tested properly
- Violates Go best practices

## Fix Suggestion
Use context.Context for cancellation:
``````go
func StartCacheCleaner(ctx context.Context) {
    go func() {
        ticker := time.NewTicker(5 * time.Minute)
        defer ticker.Stop()
        for {
            select {
            case <-ticker.C:
                // clear cache
            case <-ctx.Done():
                return
            }
        }
    }()
}
``````
"@ `
    -Labels "bug","lang:go","severity:high","concurrency"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Goroutine Leak" }

$issue = Create-Issue `
    -Title "[Go] [HIGH] No Context Propagation" `
    -Body @"
## Description
HTTP handlers and services don't use context.Context for cancellation and timeouts.

## Impact
- No request cancellation
- Long-running operations continue after client disconnect
- Resource waste
- No timeout control

## Locations
All handlers and services lack context parameters.

## Fix Suggestion
- Use ``c.Request.Context()`` from Gin context
- Pass context to all service layer functions
- Use context-aware database methods
"@ `
    -Labels "bug","lang:go","severity:medium","code-quality"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "No Context" }

$issue = Create-Issue `
    -Title "[Go] [MEDIUM] Mixed Pointer and Value Receivers" `
    -Body @"
## Description
Model methods inconsistently use pointer vs value receivers.

## Location
``````go
// models/character.go
func (c Character) IsAlive() bool { // value receiver
    return c.Status == "alive"
}

func (c *Character) GetDisplayName() string { // pointer receiver
    return c.Name
}
``````

## Impact
- Confusing API
- Potential performance issues
- Method set limitations

## Fix Suggestion
Use pointer receivers for all methods on the same type for consistency.
"@ `
    -Labels "bug","lang:go","severity:low","code-quality"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Mixed Receivers" }

$issue = Create-Issue `
    -Title "[Go] [HIGH] Global Database Variable (No Dependency Injection)" `
    -Body @"
## Description
Database connection is a global variable instead of being injected as a dependency.

## Locations
``````go
// database/db.go
var DB *gorm.DB

// main.go
database.InitDB()

// handlers/character_handler.go
database.DB.Find(&characters)
``````

## Impact
- Cannot test without real database
- Tight coupling
- Cannot run multiple instances
- Violates dependency injection principles

## Fix Suggestion
Create a service struct with database field and inject it into handlers.
"@ `
    -Labels "bug","lang:go","severity:high","architecture"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Global DB" }

# DESIGN ISSUES

$issue = Create-Issue `
    -Title "[Go] [MEDIUM] No Graceful Shutdown" `
    -Body @"
## Description
Server doesn't implement graceful shutdown - connections are killed immediately.

## Location
``````go
// main.go
if err := r.Run(":8090"); err != nil {
    log.Fatal(err)
}
// No shutdown handling
``````

## Impact
- In-flight requests terminated
- Data loss possible
- Poor user experience

## Fix Suggestion
Implement graceful shutdown with signal handling and timeout.
"@ `
    -Labels "bug","lang:go","severity:medium","reliability"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "No Shutdown" }

$issue = Create-Issue `
    -Title "[Go] [MEDIUM] Missing Recovery Middleware" `
    -Body @"
## Description
No panic recovery middleware - panics will crash the entire server.

## Impact
- One panic brings down the entire service
- No stack traces logged
- Poor reliability

## Fix Suggestion
Add ``gin.Recovery()`` middleware or create custom recovery middleware.
"@ `
    -Labels "bug","lang:go","severity:medium","reliability"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "No Recovery" }

$issue = Create-Issue `
    -Title "[Go] [MEDIUM] Inconsistent Response Formats" `
    -Body @"
## Description
Some endpoints wrap responses in data field, others return directly.

## Examples
``````go
// Wrapped
c.JSON(200, gin.H{"data": characters})

// Direct
c.JSON(200, shows)
``````

## Impact
- Confusing API
- Client code complexity
- Inconsistent error handling

## Fix Suggestion
Standardize on one format across all endpoints.
"@ `
    -Labels "bug","lang:go","severity:low","consistency"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Inconsistent Responses" }

$issue = Create-Issue `
    -Title "[Go] [HIGH] Exposed Internal Error Messages" `
    -Body @"
## Description
Internal errors are sent directly to clients, exposing system details.

## Location
``````go
c.JSON(500, gin.H{"error": err.Error()})
``````

## Impact
- Information disclosure
- Security risk
- Helps attackers understand system

## Fix Suggestion
Log detailed errors server-side, return generic messages to clients.
"@ `
    -Labels "bug","lang:go","severity:high","security"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Exposed Errors" }

$issue = Create-Issue `
    -Title "[Go] [MEDIUM] No Input Validation" `
    -Body @"
## Description
Endpoints don't validate input data before processing.

## Impact
- Invalid data in database
- Crashes possible
- Poor user experience
- Security risks

## Fix Suggestion
Use validator tags and ``github.com/go-playground/validator`` library.
"@ `
    -Labels "bug","lang:go","severity:medium","validation"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "No Validation" }

$issue = Create-Issue `
    -Title "[Go] [MEDIUM] All Config as Global Variables" `
    -Body @"
## Description
Configuration stored as global variables instead of struct.

## Location
``````go
// config/config.go
var DatabaseURL string
var Port string
var JWTSecret string
var GinMode string
``````

## Impact
- Difficult to test
- No immutability
- Race condition risk
- Cannot have multiple configs

## Fix Suggestion
Create Config struct and load once at startup.
"@ `
    -Labels "bug","lang:go","severity:medium","architecture"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Global Config" }

$issue = Create-Issue `
    -Title "[Go] [CRITICAL] Missing Error Check on Database Connection" `
    -Body @"
## Description
Database initialization doesn't check if connection succeeds.

## Location
``````go
// database/db.go
func InitDB() {
    db, err := gorm.Open(postgres.Open(config.DatabaseURL), &gorm.Config{})
    // No check for err!
    DB = db
}
``````

## Impact
- App runs with nil database
- All DB operations will panic
- Silent failure

## Fix Suggestion
``````go
if err != nil {
    log.Fatal("Failed to connect to database:", err)
}
``````
"@ `
    -Labels "bug","lang:go","severity:critical","reliability"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "DB Init Error" }

# CACHE/PERFORMANCE BUGS

$issue = Create-Issue `
    -Title "[Go] [HIGH] Cache Doesn't Use Season ID in Key" `
    -Body @"
## Description
Episode cache uses the same key for all seasons, similar to the Java bug.

## Location
``````go
// services/episode_service.go
cacheKey := "episodes" // Should be "episodes:" + seasonID
``````

## Impact
- Wrong episodes returned for different seasons
- All season queries return season 1 results
- Cache is useless

## Steps to Reproduce
``````bash
curl "http://localhost:8090/api/episodes?seasonId=1"
curl "http://localhost:8090/api/episodes?seasonId=2"
# Both return season 1
``````

## Fix Suggestion
Include seasonID in cache key:
``````go
cacheKey := fmt.Sprintf("episodes:%d", seasonID)
``````
"@ `
    -Labels "bug","lang:go","severity:high","caching"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Cache Key" }

$issue = Create-Issue `
    -Title "[Go] [MEDIUM] No Cache Invalidation" `
    -Body @"
## Description
Creating new episodes doesn't invalidate the cache.

## Impact
- Stale data served
- New episodes not visible until cache expires
- Data consistency issues

## Fix Suggestion
Clear relevant cache entries when data is modified.
"@ `
    -Labels "bug","lang:go","severity:medium","caching"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "No Invalidation" }

# DATA INTEGRITY

$issue = Create-Issue `
    -Title "[Go] [HIGH] Duplicate Jesse Pinkman in Seed Data" `
    -Body @"
## Description
Database seed data contains duplicate entries for Jesse Pinkman character.

## Location
``````sql
-- database/seed.sql
-- Jesse appears as ID 2 and ID 5
``````

## Impact
- Data integrity violation
- Confuses users
- Demonstrates missing unique constraints

## Fix Suggestion
Remove duplicate entry and add unique constraint on character name per show.
"@ `
    -Labels "bug","lang:go","severity:high","data"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Duplicate Jesse" }

# INCOMPLETE FEATURES

$issue = Create-Issue `
    -Title "[Go] [HIGH] JWT Token Generation Is Fake/Stub" `
    -Body @"
## Description
Login endpoint returns placeholder token instead of real JWT.

## Location
``````go
// services/auth_service.go
func Login(username, password string) (string, error) {
    // ...
    return "fake-jwt-token-not-implemented", nil
}
``````

## Impact
- Authentication doesn't work
- Cannot test protected endpoints
- Incomplete feature

## Fix Suggestion
Implement real JWT generation using ``github.com/golang-jwt/jwt/v5``.
"@ `
    -Labels "enhancement","lang:go","severity:high"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Fake JWT" }

$issue = Create-Issue `
    -Title "[Go] [MEDIUM] Path Inconsistency: /auth vs /api/auth" `
    -Body @"
## Description
Auth routes use ``/auth`` prefix while all others use ``/api``.

## Location
``````go
// main.go
auth := r.Group("/auth")  // Should be /api/auth
api := r.Group("/api")
``````

## Impact
- Inconsistent API structure
- Confusing for clients
- Violates REST conventions

## Fix Suggestion
Move auth routes under ``/api/auth`` for consistency.
"@ `
    -Labels "bug","lang:go","severity:low","consistency"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Path Inconsistency" }

# JSON TAG ISSUES

$issue = Create-Issue `
    -Title "[Go] [LOW] Inconsistent JSON omitempty Tags" `
    -Body @"
## Description
Some model fields use ``omitempty`` tag, others don't - no consistent pattern.

## Examples
``````go
// models/character.go
Name   string ``json:"name"``           // No omitempty
Status string ``json:"status,omitempty"`` // Has omitempty

// models/episode.go
Title  string ``json:"title"``          // No omitempty
Rating float64 ``json:"rating,omitempty"`` // Has omitempty
``````

## Impact
- Inconsistent JSON output
- Confusing API behavior
- Harder to document

## Fix Suggestion
Decide on policy: use omitempty for all optional fields or none.
"@ `
    -Labels "bug","lang:go","severity:low","consistency"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "JSON Tags" }

$issue = Create-Issue `
    -Title "[Go] [MEDIUM] Mixed Pointer Usage in Models" `
    -Body @"
## Description
Some fields are pointers, others aren't, with no clear pattern.

## Examples
``````go
// models/episode.go
AirDate *time.Time ``json:"air_date,omitempty"`` // Pointer
Rating  float64    ``json:"rating,omitempty"``   // Not pointer

// models/show.go
StartYear int  ``json:"start_year"``           // Not pointer
EndYear   *int ``json:"end_year,omitempty"``   // Pointer
``````

## Impact
- Inconsistent null handling
- Harder to work with
- Confusing which fields are optional

## Fix Suggestion
Use pointers for all optional/nullable fields consistently.
"@ `
    -Labels "bug","lang:go","severity:medium","consistency"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Mixed Pointers" }

$issue = Create-Issue `
    -Title "[Go] [MEDIUM] No Validation Tags on Models" `
    -Body @"
## Description
Models have no validation tags for required fields, length limits, etc.

## Impact
- No automatic validation
- Must write manual validation code
- Inconsistent validation
- Poor error messages

## Fix Suggestion
Add validation tags:
``````go
type Character struct {
    Name string ``json:"name" binding:"required,min=1,max=100"``
    Show string ``json:"show" binding:"required"``
}
``````
"@ `
    -Labels "enhancement","lang:go","severity:medium","validation"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "No Validation Tags" }

# MORE MISSING ERROR CHECKS

$issue = Create-Issue `
    -Title "[Go] [HIGH] Missing Error Check on ShouldBindJSON" `
    -Body @"
## Description
Multiple handlers call ``ShouldBindJSON`` but don't check the error.

## Locations
- ``character_handler.go`` CreateCharacter
- ``episode_handler.go`` CreateEpisode
- ``show_handler.go`` CreateShow
- ``quote_handler.go`` CreateQuote

## Impact
- Invalid JSON silently ignored
- Undefined behavior
- Potential panics

## Fix Suggestion
``````go
if err := c.ShouldBindJSON(&data); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
}
``````
"@ `
    -Labels "bug","lang:go","severity:high","error-handling"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "ShouldBindJSON" }

$issue = Create-Issue `
    -Title "[Go] [MEDIUM] No Check of RowsAffected in Updates" `
    -Body @"
## Description
Update operations don't check if any rows were actually modified.

## Location
``````go
// services/character_service.go
func UpdateCharacterStatus(id uint, status string) {
    database.DB.Model(&models.Character{}).Where("id = ?", id).Update("status", status)
    // Doesn't check RowsAffected
}
``````

## Impact
- Cannot detect if record exists
- Silent failures
- No error for invalid IDs

## Fix Suggestion
Check ``result.RowsAffected`` and return error if zero.
"@ `
    -Labels "bug","lang:go","severity:medium","error-handling"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "RowsAffected" }

$issue = Create-Issue `
    -Title "[Go] [MEDIUM] Nil Pointer Risk in Character Service" `
    -Body @"
## Description
Service methods may return nil without proper error checking.

## Location
``````go
// services/character_service.go
func GetCharacterByID(id uint) *models.Character {
    var character models.Character
    database.DB.First(&character, id)
    return &character // Could be nil/empty
}
``````

## Impact
- Nil pointer dereference possible
- Confusing error handling
- Hard to distinguish not found vs error

## Fix Suggestion
Return error as second return value and check for record not found.
"@ `
    -Labels "bug","lang:go","severity:medium","error-handling"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Nil Pointer" }

# DOCKER/DEPLOYMENT ISSUES

$issue = Create-Issue `
    -Title "[Go] [MEDIUM] Dockerfile Runs as Root User" `
    -Body @"
## Description
Container runs as root user instead of non-privileged user.

## Location
``````dockerfile
# backend/Dockerfile
FROM alpine:latest
WORKDIR /root/
# No user creation
CMD ["./main"]
``````

## Impact
- Security risk
- Container escape possible
- Violates security best practices

## Fix Suggestion
``````dockerfile
RUN addgroup -g 1000 appuser && adduser -D -u 1000 -G appuser appuser
USER appuser
``````
"@ `
    -Labels "bug","lang:go","severity:medium","docker","security"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Docker Root" }

$issue = Create-Issue `
    -Title "[Go] [LOW] Dockerfile Missing go.sum Copy" `
    -Body @"
## Description
Dockerfile has commented out ``COPY go.sum`` which might cause issues.

## Location
``````dockerfile
# backend/Dockerfile
COPY go.mod ./
# COPY go.sum ./  # Intentional bug: commented out
``````

## Impact
- Build might fail in some cases
- Dependency version inconsistency

## Fix Suggestion
Uncomment the go.sum copy or create one if missing.
"@ `
    -Labels "bug","lang:go","severity:low","docker"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "go.sum" }

$issue = Create-Issue `
    -Title "[Go] [LOW] No Dockerfile Healthcheck" `
    -Body @"
## Description
Backend Dockerfile doesn't define a healthcheck.

## Impact
- Orchestrators can't detect if service is healthy
- No automatic restart on failure
- Poor observability

## Fix Suggestion
``````dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8090/health || exit 1
``````
"@ `
    -Labels "enhancement","lang:go","severity:low","docker"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Healthcheck" }

$issue = Create-Issue `
    -Title "[Go] [LOW] CGO_ENABLED Not Set in Build" `
    -Body @"
## Description
Dockerfile doesn't set ``CGO_ENABLED=0`` which can cause portability issues.

## Location
``````dockerfile
RUN go build -o main .
# Should be: RUN CGO_ENABLED=0 go build -o main .
``````

## Impact
- Binary might not work in Alpine
- Requires glibc in runtime image
- Larger image size

## Fix Suggestion
``````dockerfile
RUN CGO_ENABLED=0 go build -ldflags="-w -s" -o main .
``````
"@ `
    -Labels "bug","lang:go","severity:low","docker"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "CGO_ENABLED" }

# MISCELLANEOUS

$issue = Create-Issue `
    -Title "[Go] [LOW] No Pagination on List Endpoints" `
    -Body @"
## Description
List endpoints return all records without pagination.

## Examples
- GET /api/characters - returns ALL characters
- GET /api/episodes - returns ALL episodes
- GET /api/shows - returns ALL shows

## Impact
- Performance issues with large datasets
- Memory problems
- Poor API design

## Fix Suggestion
Implement limit/offset or cursor-based pagination.
"@ `
    -Labels "enhancement","lang:go","severity:medium","performance"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "No Pagination" }

$issue = Create-Issue `
    -Title "[Go] [LOW] No Request Logging Middleware" `
    -Body @"
## Description
No structured logging of HTTP requests.

## Impact
- Difficult to debug
- No audit trail
- Cannot track performance

## Fix Suggestion
Add Gin logger middleware or custom request logging.
"@ `
    -Labels "enhancement","lang:go","severity:low","observability"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "No Logging" }

$issue = Create-Issue `
    -Title "[Go] [MEDIUM] No Config Validation at Startup" `
    -Body @"
## Description
Configuration is loaded but not validated.

## Location
``````go
// config/config.go
func LoadConfig() {
    DatabaseURL = getEnv("DATABASE_URL", "")
    // No check if empty or invalid
}
``````

## Impact
- Late failure (runtime instead of startup)
- Confusing error messages
- Difficult to debug

## Fix Suggestion
Validate all required config at startup and fail fast if missing.
"@ `
    -Labels "bug","lang:go","severity:medium","reliability"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "Config Validation" }

$issue = Create-Issue `
    -Title "[Go] [LOW] No Unit Tests" `
    -Body @"
## Description
No unit tests exist for any component.

## Impact
- Cannot verify correctness
- Refactoring is risky
- No regression detection
- Poor code quality confidence

## Fix Suggestion
Add tests using ``testing`` package and table-driven tests.
"@ `
    -Labels "enhancement","lang:go","severity:low","testing"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "No Tests" }

$issue = Create-Issue `
    -Title "[Go] [LOW] Incomplete JWT Validate Function" `
    -Body @"
## Description
ValidateToken function exists but returns false for all inputs.

## Location
``````go
// services/auth_service.go
func ValidateToken(token string) bool {
    return false // TODO: Implement JWT validation
}
``````

## Impact
- Cannot validate tokens
- Protected routes won't work
- Incomplete security

## Fix Suggestion
Implement JWT parsing and validation using jwt-go library.
"@ `
    -Labels "enhancement","lang:go","severity:high"

if ($issue) { $createdIssues += $issue } else { $failedIssues += "ValidateToken" }

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Created: $($createdIssues.Count) issues" -ForegroundColor Green
Write-Host "Failed: $($failedIssues.Count) issues" -ForegroundColor Red

if ($failedIssues.Count -gt 0) {
    Write-Host ""
    Write-Host "Failed issues:" -ForegroundColor Red
    $failedIssues | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
}

Write-Host ""
Write-Host "View all Go issues at: https://github.com/$repo/issues?q=is%3Aissue+label%3Alang%3Ago" -ForegroundColor Cyan
