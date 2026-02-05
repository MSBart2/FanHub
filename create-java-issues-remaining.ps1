# Create the 4 failed GitHub Issues for Java Bugs
# Uses temp files to avoid escaping issues

$owner = "MSBart2"
$repo = "FanHub"
$tempDir = "$env:TEMP\java-issues"

Write-Host "Creating 4 remaining GitHub issues for Java bugs..." -ForegroundColor Green
Write-Host "Using temp files to avoid escaping issues" -ForegroundColor Cyan
Write-Host ""

# Create temp directory
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

# Issue #2: Episode cache bug
Write-Host "Creating Issue #2: Episode cache bug..." -ForegroundColor Yellow

$body2 = @"
## Bug Description
The @Cacheable annotation doesn't include seasonId in the cache key, causing filtered requests to return cached unfiltered data.

## Location
``java/backend/src/main/java/com/fanhub/service/EpisodeService.java`` (line 26)

## Impact
🔴 **CRITICAL** - Data display bug
- Season filter appears broken to users
- Clicking 'Season 2' might show Season 1 episodes from cache
- Cache returns ALL episodes regardless of filter parameter

## Code Evidence
``````java
// BUG: Cache key doesn't include seasonId parameter
@Cacheable(value = "episodes")
public List<Episode> getEpisodesBySeasonId(Long seasonId) {
    return episodeRepository.findBySeasonId(seasonId);
}
``````

## Steps to Reproduce
1. Load the Episodes page (loads all episodes)
2. Click 'Season 2' button
3. Observe that all episodes are still shown (cached data)
4. Wait 30 seconds (cache expires) and try again - now filtering works

## Fix Suggestion
Use ``@Cacheable(value = "episodes", key = "#seasonId")`` to include seasonId in cache key.

For full details, see ``java/BUGS.md`` (Bug #2)
"@

$body2 | Out-File -FilePath "$tempDir\issue2.md" -Encoding utf8

gh issue create --repo "$owner/$repo" `
  --title "[Java] [CRITICAL] Episode cache returns all episodes regardless of season filter" `
  --body-file "$tempDir\issue2.md" `
  --label "bug,lang:java,severity:critical"

# Issue #3: Inconsistent API paths
Write-Host "Creating Issue #3: Inconsistent API paths..." -ForegroundColor Yellow

$body3 = @"
## Bug Description
Most API controllers use /api/* prefix, but AuthController uses /auth (no /api prefix), creating API inconsistency.

## Location
``java/backend/src/main/java/com/fanhub/controller/AuthController.java`` (line 16)

## Impact
🔴 **CRITICAL** - API Design Bug
- Developers must remember two different URL patterns
- API documentation is confusing
- Frontend code mixes paths (``/api/characters`` vs ``/auth/login``)

## Code Evidence
``````java
// Most controllers
@RequestMapping("/api/characters")
@RequestMapping("/api/episodes")
@RequestMapping("/api/shows")

// AuthController - INCONSISTENT
@RequestMapping("/auth")  // No /api prefix!
``````

## Fix Suggestion
Change AuthController to ``@RequestMapping("/api/auth")``

For full details, see ``java/BUGS.md`` (Bug #3)
"@

$body3 | Out-File -FilePath "$tempDir\issue3.md" -Encoding utf8

gh issue create --repo "$owner/$repo" `
  --title "[Java] [CRITICAL] Auth routes use different path prefix than other API routes" `
  --body-file "$tempDir\issue3.md" `
  --label "bug,lang:java,severity:critical"

# Issue #8: CORS wide open
Write-Host "Creating Issue #8: CORS wide open..." -ForegroundColor Yellow

$body8 = @"
## Bug Description
CORS configured with ``origins = "*"`` on all controllers and in WebConfig.

## Location
Multiple files: All controllers + ``java/backend/src/main/java/com/fanhub/config/WebConfig.java``

## Impact
⚠️ **HIGH** - Security misconfiguration
- Any origin can make requests
- CSRF vulnerability
- Should be restricted in production

## Code Evidence
``````java
// Every controller
@CrossOrigin(origins = "*")  // Wide open!

// WebConfig.java
.allowedOrigins("*")
``````

## Fix Suggestion
Configure CORS to allow only specific origins, different for dev/prod environments.

For full details, see ``java/BUGS.md`` (Bug #8)
"@

$body8 | Out-File -FilePath "$tempDir\issue8.md" -Encoding utf8

gh issue create --repo "$owner/$repo" `
  --title "[Java] [SECURITY] CORS wide open for all origins" `
  --body-file "$tempDir\issue8.md" `
  --label "bug,lang:java,severity:high"

# Issue #18: Incomplete JWT
Write-Host "Creating Issue #18: Incomplete JWT authentication..." -ForegroundColor Yellow

$body18 = @"
## Bug Description
AuthController returns 'not_implemented' for JWT token, has no logout/refresh endpoints.

## Location
``java/backend/src/main/java/com/fanhub/controller/AuthController.java``

## Impact
⚠️ **HIGH** - Incomplete feature
- No JWT token generation
- No logout endpoint
- No token refresh
- No forgot password
- No email validation

## Code Evidence
``````java
// Returns placeholder instead of real token
response.put("token", "not_implemented");  // TODO!

// Missing endpoints:
// - POST /logout
// - POST /refresh
// - POST /forgot-password
// - POST /reset-password
``````

## Fix Suggestion
Implement complete JWT authentication flow with token generation, validation, and refresh.

For full details, see ``java/BUGS.md`` (Bug #18)
"@

$body18 | Out-File -FilePath "$tempDir\issue18.md" -Encoding utf8

gh issue create --repo "$owner/$repo" `
  --title "[Java] [BUG] Incomplete JWT authentication implementation" `
  --body-file "$tempDir\issue18.md" `
  --label "bug,lang:java,severity:high"

# Cleanup
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "`n✅ Successfully created 4 remaining issues!" -ForegroundColor Green
Write-Host "Total Java issues: 36/36 complete" -ForegroundColor Green
Write-Host "`nView all Java issues at:" -ForegroundColor Cyan
Write-Host "https://github.com/$owner/$repo/issues?q=is:issue+label:lang:java" -ForegroundColor White
