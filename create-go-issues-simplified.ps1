# Create GitHub Issues for Go Implementation Bugs
# Simplified version using only existing labels

$ErrorActionPreference = "Continue"
$repo = "MSBart2/FanHub"
$created = 0
$failed = 0

Write-Host "Creating GitHub issues for Go implementation..." -ForegroundColor Cyan

# Ensure lang:go label exists
gh label create "lang:go" --description "Go/Gin implementation" --color "00ADD8" --repo $repo 2>$null

# Helper function
function Create-Issue {
    param([string]$Title, [string]$Body, [string[]]$Labels)
    
    try {
        $tempFile = [System.IO.Path]::GetTempFileName()
        $Body | Out-File -FilePath $tempFile -Encoding UTF8
        $labelArgs = $Labels | ForEach-Object { "--label", $_ }
        $result = gh issue create --title $Title --body-file $tempFile --repo $repo @labelArgs 2>&1
        Remove-Item $tempFile -ErrorAction SilentlyContinue
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ $Title" -ForegroundColor Green
            return 1
        } else {
            Write-Host "✗ $Title - $result" -ForegroundColor Red
            return 0
        }
    } catch {
        Write-Host "✗ $Title - $_" -ForegroundColor Red
        return 0
    }
}

# CRITICAL SECURITY ISSUES (6)

$created += Create-Issue "[Go] [CRITICAL] SQL Injection in Character Search" @"
## Description
The character search endpoint is vulnerable to SQL injection attacks due to string concatenation.

## Location
\`\`\`go
// handlers/character_handler.go - search functionality
\`\`\`

## Impact
- Attackers can extract sensitive data
- Database could be modified or deleted
- Complete system compromise possible

## Fix
Use parameterized queries with GORM's safe query builders.
"@ @("bug", "lang:go", "severity:critical")

$created += Create-Issue "[Go] [CRITICAL] Hardcoded JWT Secret" @"
## Description
JWT secret has hardcoded fallback value that could be used in production.

## Location
\`\`\`go
// config/config.go
var JWTSecret = getEnv("JWT_SECRET", "super-secret-key-do-not-use-in-production")
\`\`\`

## Impact
- Anyone can forge valid JWT tokens
- Complete authentication bypass
- Unauthorized access to all resources

## Fix
Require JWT secret from environment with no default fallback.
"@ @("bug", "lang:go", "severity:critical")

$created += Create-Issue "[Go] [CRITICAL] Password Hash Exposed in JSON" @"
## Description
User model exposes password hash in API responses.

## Location
\`\`\`go
// models/user.go
PasswordHash string \`json:"password_hash"\` // Should be json:"-"
\`\`\`

## Impact
- Password hashes exposed to clients
- Makes brute force attacks easier
- Privacy and security violation

## Fix
Use \`json:"-"\` tag to exclude from JSON serialization.
"@ @("bug", "lang:go", "severity:critical")

$created += Create-Issue "[Go] [CRITICAL] CORS Allows All Origins" @"
## Description
CORS middleware allows requests from any origin.

## Location
\`\`\`go
// middleware/cors.go
AllowOrigins: []string{"*"},
\`\`\`

## Impact
- Any website can make requests to the API
- CSRF attacks possible
- Credential theft risk

## Fix
Configure specific allowed origins based on environment.
"@ @("bug", "lang:go", "severity:critical")

$created += Create-Issue "[Go] [CRITICAL] Auth Middleware Not Implemented" @"
## Description
Authentication middleware exists but just passes all requests through.

## Location
\`\`\`go
// middleware/auth.go
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next() // TODO: Implement
    }
}
\`\`\`

## Impact
- No authentication enforcement
- Protected endpoints publicly accessible
- Complete security bypass

## Fix
Implement JWT token validation.
"@ @("bug", "lang:go", "severity:critical")

$created += Create-Issue "[Go] [CRITICAL] Missing Error Check on DB Init" @"
## Description
Database initialization doesn't check if connection succeeds.

## Location
\`\`\`go
// database/db.go
db, err := gorm.Open(...)
// No check for err!
DB = db
\`\`\`

## Impact
- App runs with nil database
- All DB operations will panic
- Silent failure

## Fix
Check error and fail fast if DB connection fails.
"@ @("bug", "lang:go", "severity:critical")

# HIGH SEVERITY (10)

$created += Create-Issue "[Go] [HIGH] Missing Error Checks Throughout Codebase" @"
## Description
Multiple locations ignore error returns - the most common Go mistake!

## Locations
- \`database.DB.First()\` - error ignored
- \`strconv.Atoi()\` - error ignored
- \`bcrypt.GenerateFromPassword()\` - error ignored
- \`ShouldBindJSON()\` - error ignored in multiple handlers

## Impact
- Silent failures
- Undefined behavior
- Data corruption possible
- Difficult debugging

## Fix
Always check errors: \`if err != nil { return err }\`
"@ @("bug", "lang:go", "severity:high")

$created += Create-Issue "[Go] [HIGH] Race Condition in Episode Cache" @"
## Description
Global cache map accessed concurrently without mutex protection.

## Location
\`\`\`go
// services/episode_service.go
var episodeCache = make(map[string][]models.Episode)

func GetEpisodesBySeason(...) {
    if cached, ok := episodeCache[cacheKey]; ok { // RACE!
        return cached
    }
    episodeCache[cacheKey] = episodes // RACE!
}
\`\`\`

## Impact
- Data race (detectable with \`go run -race\`)
- Possible crashes or data corruption
- Concurrent map writes cause panic

## How to Detect
\`\`\`bash
go run -race main.go
# Make concurrent requests
\`\`\`

## Fix
Use \`sync.RWMutex\` or \`sync.Map\`.
"@ @("bug", "lang:go", "severity:high")

$created += Create-Issue "[Go] [HIGH] Goroutine Leak in Episode Service" @"
## Description
Background goroutine started in init() has no way to be stopped.

## Location
\`\`\`go
// services/episode_service.go
func init() {
    go func() {
        for {
            time.Sleep(5 * time.Minute)
            // Clear cache
        }
    }() // No cancellation!
}
\`\`\`

## Impact
- Goroutine runs forever
- Resource leak
- Cannot be tested properly
- Violates Go best practices

## Fix
Use context.Context for cancellation with ticker and select.
"@ @("bug", "lang:go", "severity:high")

$created += Create-Issue "[Go] [HIGH] Global Database Variable" @"
## Description
Database connection is global variable instead of dependency injection.

## Locations
\`\`\`go
// database/db.go
var DB *gorm.DB

// handlers use: database.DB.Find()
\`\`\`

## Impact
- Cannot test without real database
- Tight coupling
- Cannot run multiple instances
- Violates DI principles

## Fix
Create service struct with database field and inject into handlers.
"@ @("bug", "lang:go", "severity:high")

$created += Create-Issue "[Go] [HIGH] Exposed Internal Error Messages" @"
## Description
Internal errors sent directly to clients, exposing system details.

## Location
\`\`\`go
c.JSON(500, gin.H{"error": err.Error()})
\`\`\`

## Impact
- Information disclosure
- Security risk
- Helps attackers understand system

## Fix
Log detailed errors server-side, return generic messages to clients.
"@ @("bug", "lang:go", "severity:high")

$created += Create-Issue "[Go] [HIGH] Cache Doesn't Use Season ID in Key" @"
## Description
Episode cache uses same key for all seasons (like Java bug).

## Location
\`\`\`go
// services/episode_service.go
cacheKey := "episodes" // Should include seasonID
\`\`\`

## Impact
- Wrong episodes returned for different seasons
- All season queries return season 1
- Cache is useless

## Steps to Reproduce
\`\`\`bash
curl "http://localhost:8090/api/episodes?seasonId=1"
curl "http://localhost:8090/api/episodes?seasonId=2"
# Both return season 1
\`\`\`

## Fix
Include seasonID in cache key: \`fmt.Sprintf("episodes:%d", seasonID)\`
"@ @("bug", "lang:go", "severity:high")

$created += Create-Issue "[Go] [HIGH] Duplicate Jesse Pinkman in Seed Data" @"
## Description
Database seed data contains duplicate entries for Jesse Pinkman.

## Location
\`\`\`sql
-- database/seed.sql
-- Jesse appears as ID 2 and ID 5
\`\`\`

## Impact
- Data integrity violation
- Confuses users
- Missing unique constraints

## Fix
Remove duplicate and add unique constraint on character name per show.
"@ @("bug", "lang:go", "severity:high")

$created += Create-Issue "[Go] [HIGH] JWT Token Generation Is Fake" @"
## Description
Login endpoint returns placeholder token instead of real JWT.

## Location
\`\`\`go
// services/auth_service.go
return "fake-jwt-token-not-implemented", nil
\`\`\`

## Impact
- Authentication doesn't work
- Cannot test protected endpoints
- Incomplete feature

## Fix
Implement real JWT generation using github.com/golang-jwt/jwt/v5.
"@ @("bug", "lang:go", "severity:high")

$created += Create-Issue "[Go] [HIGH] Weak Password Requirements" @"
## Description
Password validation only requires 6 characters.

## Location
\`\`\`go
// services/auth_service.go
if len(password) < 6 {
    return "", errors.New("password must be at least 6 characters")
}
\`\`\`

## Impact
- Weak passwords allowed
- Easy to brute force
- Poor security posture

## Fix
Require minimum 12 characters with complexity requirements.
"@ @("bug", "lang:go", "severity:high")

$created += Create-Issue "[Go] [HIGH] No Context Propagation" @"
## Description
HTTP handlers and services don't use context.Context.

## Impact
- No request cancellation
- Long operations continue after client disconnect
- Resource waste
- No timeout control

## Fix
Use \`c.Request.Context()\` and pass to all service functions.
"@ @("bug", "lang:go", "severity:high")

# MEDIUM SEVERITY (10)

$created += Create-Issue "[Go] [MEDIUM] No Graceful Shutdown" @"
## Description
Server doesn't implement graceful shutdown.

## Location
\`\`\`go
// main.go
r.Run(":8090") // No shutdown handling
\`\`\`

## Impact
- In-flight requests terminated
- Data loss possible
- Poor user experience

## Fix
Implement graceful shutdown with signal handling.
"@ @("bug", "lang:go", "severity:medium")

$created += Create-Issue "[Go] [MEDIUM] Missing Recovery Middleware" @"
## Description
No panic recovery middleware.

## Impact
- One panic crashes entire server
- No stack traces logged
- Poor reliability

## Fix
Add \`gin.Recovery()\` middleware.
"@ @("bug", "lang:go", "severity:medium")

$created += Create-Issue "[Go] [MEDIUM] Inconsistent Response Formats" @"
## Description
Some endpoints wrap in data field, others don't.

## Examples
\`\`\`go
c.JSON(200, gin.H{"data": characters}) // Wrapped
c.JSON(200, shows) // Direct
\`\`\`

## Impact
- Confusing API
- Client code complexity

## Fix
Standardize on one format.
"@ @("bug", "lang:go", "severity:medium")

$created += Create-Issue "[Go] [MEDIUM] No Input Validation" @"
## Description
Endpoints don't validate input data.

## Impact
- Invalid data in database
- Crashes possible
- Security risks

## Fix
Use validator tags and binding:"required".
"@ @("bug", "lang:go", "severity:medium")

$created += Create-Issue "[Go] [MEDIUM] All Config as Global Variables" @"
## Description
Configuration stored as global variables.

## Location
\`\`\`go
// config/config.go
var DatabaseURL string
var Port string
\`\`\`

## Impact
- Difficult to test
- No immutability
- Race condition risk

## Fix
Create Config struct and load once.
"@ @("bug", "lang:go", "severity:medium")

$created += Create-Issue "[Go] [MEDIUM] No Cache Invalidation" @"
## Description
Creating new episodes doesn't invalidate cache.

## Impact
- Stale data served
- New episodes not visible until cache expires

## Fix
Clear relevant cache entries when data modified.
"@ @("bug", "lang:go", "severity:medium")

$created += Create-Issue "[Go] [MEDIUM] Mixed Pointer and Value Receivers" @"
## Description
Model methods inconsistently use pointer vs value receivers.

## Location
\`\`\`go
// models/character.go
func (c Character) IsAlive() bool    // value
func (c *Character) GetDisplayName() // pointer
\`\`\`

## Impact
- Confusing API
- Performance issues

## Fix
Use pointer receivers consistently.
"@ @("bug", "lang:go", "severity:medium")

$created += Create-Issue "[Go] [MEDIUM] Mixed Pointer Usage in Models" @"
## Description
Some fields are pointers, others aren't, no clear pattern.

## Examples
\`\`\`go
AirDate *time.Time // Pointer
Rating  float64    // Not pointer
\`\`\`

## Impact
- Inconsistent null handling
- Confusing API

## Fix
Use pointers for all optional fields consistently.
"@ @("bug", "lang:go", "severity:medium")

$created += Create-Issue "[Go] [MEDIUM] No Validation Tags on Models" @"
## Description
Models have no validation tags.

## Impact
- No automatic validation
- Inconsistent validation

## Fix
Add binding tags: \`binding:"required,min=1,max=100"\`
"@ @("bug", "lang:go", "severity:medium")

$created += Create-Issue "[Go] [MEDIUM] No Config Validation at Startup" @"
## Description
Configuration loaded but not validated.

## Impact
- Late failure (runtime vs startup)
- Confusing errors

## Fix
Validate all required config at startup.
"@ @("bug", "lang:go", "severity:medium")

# LOW SEVERITY (8)

$created += Create-Issue "[Go] [LOW] Path Inconsistency: /auth vs /api/auth" @"
## Description
Auth routes use /auth while others use /api.

## Location
\`\`\`go
auth := r.Group("/auth")  // Should be /api/auth
api := r.Group("/api")
\`\`\`

## Impact
- Inconsistent API structure

## Fix
Move auth under /api/auth.
"@ @("bug", "lang:go", "severity:low")

$created += Create-Issue "[Go] [LOW] Inconsistent JSON omitempty Tags" @"
## Description
Some fields use omitempty, others don't.

## Impact
- Inconsistent JSON output

## Fix
Decide on policy for omitempty usage.
"@ @("bug", "lang:go", "severity:low")

$created += Create-Issue "[Go] [LOW] Dockerfile Runs as Root" @"
## Description
Container runs as root user.

## Impact
- Security risk
- Violates best practices

## Fix
Create and use non-root user.
"@ @("bug", "lang:go", "severity:low")

$created += Create-Issue "[Go] [LOW] Dockerfile Missing go.sum Copy" @"
## Description
Dockerfile has commented out COPY go.sum.

## Impact
- Build might fail
- Dependency version inconsistency

## Fix
Uncomment go.sum copy.
"@ @("bug", "lang:go", "severity:low")

$created += Create-Issue "[Go] [LOW] No Dockerfile Healthcheck" @"
## Description
Backend Dockerfile doesn't define healthcheck.

## Impact
- Orchestrators can't detect health
- Poor observability

## Fix
Add HEALTHCHECK instruction.
"@ @("bug", "lang:go", "severity:low")

$created += Create-Issue "[Go] [LOW] CGO_ENABLED Not Set" @"
## Description
Dockerfile doesn't set CGO_ENABLED=0.

## Impact
- Binary might not work in Alpine
- Larger image size

## Fix
Use CGO_ENABLED=0 in build.
"@ @("bug", "lang:go", "severity:low")

$created += Create-Issue "[Go] [LOW] No Pagination" @"
## Description
List endpoints return all records.

## Impact
- Performance issues with large datasets

## Fix
Implement limit/offset pagination.
"@ @("bug", "lang:go", "severity:low")

$created += Create-Issue "[Go] [LOW] No Request Logging" @"
## Description
No structured logging of HTTP requests.

## Impact
- Difficult to debug

## Fix
Add Gin logger middleware.
"@ @("bug", "lang:go", "severity:low")

# ENHANCEMENTS (2)

$created += Create-Issue "[Go] [ENHANCEMENT] Incomplete JWT Validate Function" @"
## Description
ValidateToken function returns false for all inputs.

## Location
\`\`\`go
func ValidateToken(token string) bool {
    return false // TODO
}
\`\`\`

## Fix
Implement JWT parsing and validation.
"@ @("enhancement", "lang:go", "severity:medium")

$created += Create-Issue "[Go] [ENHANCEMENT] No Unit Tests" @"
## Description
No unit tests exist.

## Impact
- Cannot verify correctness
- Refactoring is risky

## Fix
Add tests using testing package.
"@ @("enhancement", "lang:go", "severity:low")

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Created $created issues successfully!" -ForegroundColor Green
Write-Host "View at: https://github.com/$repo/issues?q=is%3Aissue+label%3Alang%3Ago" -ForegroundColor Cyan
