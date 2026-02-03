# Script to create GitHub issues for all FanHub bugs
# Run this script to create all 46+ bug issues in the repository

$owner = "MSBart2"
$repo = "FanHub"

Write-Host "Creating GitHub issues for FanHub bugs..." -ForegroundColor Cyan
Write-Host "Repository: $owner/$repo" -ForegroundColor Yellow
Write-Host ""

# Change to repo directory
Set-Location "C:\Users\rmathis\source\FanHub"

# Array to store created issue numbers
$createdIssues = @()

# ===== CRITICAL BUGS =====
Write-Host "Creating CRITICAL bugs..." -ForegroundColor Red

# Bug 1: Duplicate Jesse Pinkman
$issue1 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] Duplicate character data causes UI to show two Jesse Pinkman entries" `
  --label "bug" `
  --label "critical" `
  --body @"
## Bug Description
Jesse Pinkman appears TWICE in the characters table with different IDs (2 and 5), causing duplicate entries in the UI and split data across records.

## Location
``````
fanhub/backend/src/database/seed.sql (lines 36 and 39)
``````

## Impact
🔴 **CRITICAL** - Page-breaking bug
- Characters page shows two Jesse Pinkman cards
- Character detail pages show incomplete data
- Quotes are split between two different character records

## Evidence
``````sql
-- Line 36
(1, 'Jesse Pinkman', 'Aaron Paul', 'Walt''s former student and business partner...', true, 'alive'),
-- Line 39 - DUPLICATE!
(1, 'Jesse Pinkman', 'Aaron Paul', 'Walt''s former student and partner in the methamphetamine business.', true, 'alive'),
``````

## Expected Behavior
Only one Jesse Pinkman character should exist in the database.

## Steps to Reproduce
1. Start the application
2. Navigate to /characters
3. Observe two Jesse Pinkman cards displayed

## Fix Suggestion
Remove the duplicate entry on line 39 and update quote references to use the correct character_id.
"@

$createdIssues += $issue1
Write-Host "✓ Created: Duplicate Jesse Pinkman bug" -ForegroundColor Green

# Bug 2: Episode cache
$issue2 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] Episode cache returns all episodes regardless of season filter" `
  --label "bug" `
  --label "critical" `
  --body @"
## Bug Description
The episode cache doesn't account for the ``seasonId`` parameter, causing filtered requests to return cached unfiltered data.

## Location
``````
fanhub/frontend/src/pages/Episodes.js (lines 76-84)
``````

## Impact
🔴 **CRITICAL** - Data display bug
- Season filter appears broken to users
- Clicking "Season 2" might show Season 1 episodes from cache
- Inconsistent behavior based on timing (works after cache expires)

## Evidence
``````javascript
// BUG: Using cached data regardless of which season was requested
if (episodeCache && cacheTimestamp && (now - cacheTimestamp) < 30000) {
  setEpisodes(episodeCache);  // Returns ALL episodes, not filtered ones!
  setLoading(false);
  return;
}
``````

## Expected Behavior
Cache should either:
1. Be keyed by seasonId, OR
2. Not be used when a season filter is applied

## Steps to Reproduce
1. Load the Episodes page (loads all episodes)
2. Click "Season 2" button
3. Observe that all episodes are still shown (cached data)
4. Wait 30 seconds and try again - now filtering works

## Fix Suggestion
Include seasonId in cache key or bypass cache when filtering.
"@

$createdIssues += $issue2
Write-Host "✓ Created: Episode cache bug" -ForegroundColor Green

# Bug 3: Inconsistent API paths
$issue3 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] Auth routes use different path prefix than other API routes" `
  --label "bug" `
  --label "critical" `
  --body @"
## Bug Description
Most API routes use ``/api/*`` prefix, but auth routes use ``/auth`` (no ``/api`` prefix), creating confusion and inconsistent API design.

## Location
``````
fanhub/backend/src/index.js (lines 30-34)
``````

## Impact
🔴 **CRITICAL** - API design inconsistency
- Developers must remember two different URL patterns
- API documentation is confusing
- Frontend code mixes paths (``/api/characters`` vs ``/auth/login``)

## Evidence
``````javascript
app.use('/api/shows', showsRouter);
app.use('/api/characters', charactersRouter);
app.use('/api/episodes', episodesRoutes);
app.use('/api/quotes', quotesRouter);
app.use('/auth', authRoutes);  // INCONSISTENT - no /api prefix!
``````

## Expected Behavior
All API routes should use the ``/api/*`` prefix for consistency.

## Fix Suggestion
Change auth route mounting to:
``````javascript
app.use('/api/auth', authRoutes);
``````

And update frontend API calls accordingly.
"@

$createdIssues += $issue3
Write-Host "✓ Created: Inconsistent API paths bug" -ForegroundColor Green

# ===== HIGH PRIORITY BUGS =====
Write-Host ""
Write-Host "Creating HIGH priority bugs..." -ForegroundColor Yellow

# Bug 4: Missing error handling
$issue4 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] Missing error handling in characters GET endpoint" `
  --label "bug" `
  --label "high-priority" `
  --body @"
## Bug Description
The GET ``/api/characters`` endpoint has no try/catch block, while other routes in the same file DO have error handling (inconsistent).

## Location
``````
fanhub/backend/src/routes/characters.js (lines 10-45)
``````

## Impact
⚠️ **HIGH** - Error handling gap
- Database errors will crash the endpoint
- Unhandled promise rejection if database query fails
- User sees generic 500 error with no helpful message

## Evidence
``````javascript
router.get('/', async (req, res) => {
  // No try/catch here - inconsistent error handling!
  const result = await query(sql, params);
  res.json(result.rows);
});
``````

## Fix Suggestion
Wrap in try/catch block like other routes in the same file.
"@

$createdIssues += $issue4
Write-Host "✓ Created: Missing error handling" -ForegroundColor Green

# Bug 5: DELETE without error handling
$issue5 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] DELETE character endpoint has no error handling" `
  --label "bug" `
  --label "high-priority" `
  --body @"
## Bug Description
DELETE endpoint for characters has no error handling, causing unhandled promise rejections on database errors.

## Location
``````
fanhub/backend/src/routes/characters.js (lines 158-168)
``````

## Impact
⚠️ **HIGH** - Unhandled errors
- Database errors cause server crashes
- No graceful error responses

## Evidence
``````javascript
router.delete('/:id', async (req, res) => {
  // No try/catch - just gone if it fails!
  const result = await query('DELETE FROM characters WHERE id = $1...', [req.params.id]);
``````

## Fix Suggestion
Add try/catch block for error handling.
"@

$createdIssues += $issue5
Write-Host "✓ Created: DELETE error handling" -ForegroundColor Green

# Bug 6: Mixed HTTP status codes
$issue6 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] Inconsistent HTTP status codes for POST operations" `
  --label "bug" `
  --label "high-priority" `
  --body @"
## Bug Description
POST endpoints return different status codes across route files - some return 200, some return 201 (correct).

## Location
Multiple route files

## Impact
⚠️ **HIGH** - API consistency
- characters.js returns 200 (incorrect)
- shows.js, episodes.js, quotes.js return 201 (correct)

## Evidence
``````javascript
// characters.js line 110 - WRONG
res.json(result.rows[0]);  // Default 200, not 201!

// shows.js line 80 - CORRECT
res.status(201).json(result.rows[0]);
``````

## Expected Behavior
All POST endpoints that create resources should return 201 Created.

## Fix Suggestion
Update characters.js POST handler to return 201 status code.
"@

$createdIssues += $issue6
Write-Host "✓ Created: HTTP status codes" -ForegroundColor Green

# Bug 7: Weak password requirements
$issue7 = gh issue create `
  --repo "$owner/$repo" `
  --title "[SECURITY] Weak password requirements allow easily guessable passwords" `
  --label "bug" `
  --label "security" `
  --label "high-priority" `
  --body @"
## Bug Description
Password validation only requires 6 characters minimum with no complexity requirements.

## Location
``````
fanhub/backend/src/routes/auth.js (line 27)
``````

## Impact
⚠️ **HIGH** - Security vulnerability
- Users can create weak passwords like "123456"
- Accounts vulnerable to brute force attacks

## Evidence
``````javascript
// Password requirements - should be stronger!
if (password.length < 6) {
  return res.status(400).json({ error: 'Password must be at least 6 characters' });
}
``````

## Expected Behavior
Passwords should require:
- Minimum 8-10 characters
- Mix of uppercase and lowercase
- At least one number
- At least one special character

## Fix Suggestion
Implement proper password complexity validation.
"@

$createdIssues += $issue7
Write-Host "✓ Created: Weak password requirements" -ForegroundColor Green

# Bug 8: Invalid bcrypt hash
$issue8 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] Invalid bcrypt hash in seed data prevents admin login" `
  --label "bug" `
  --label "high-priority" `
  --body @"
## Bug Description
Admin user seed data contains an invalid/placeholder bcrypt hash that won't authenticate.

## Location
``````
fanhub/backend/src/database/seed.sql (line 65)
``````

## Impact
⚠️ **HIGH** - Authentication failure
- Admin user cannot log in
- Testing admin features is impossible

## Evidence
``````sql
-- Password hash is bcrypt of 'admin123'
INSERT INTO users (email, password_hash, username, display_name, role) VALUES
('admin@fanhub.test', '\$2b\$10\$rQZ5QZQZ5QZQZ5QZQZ5QZOeH5H5H5H5H5H5H5H5H5H5H5H5H5H5H5', 'admin', 'Admin User', 'admin');
``````

Note: This is clearly a fake hash (repeating pattern).

## Fix Suggestion
Generate a real bcrypt hash for the admin user or provide setup instructions.
"@

$createdIssues += $issue8
Write-Host "✓ Created: Invalid bcrypt hash" -ForegroundColor Green

# Bug 9: Inconsistent response formats
$issue9 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] API endpoints return inconsistent response formats" `
  --label "bug" `
  --label "high-priority" `
  --body @"
## Bug Description
Different endpoints return different response structures, making the API unpredictable.

## Location
Multiple route files

## Impact
⚠️ **HIGH** - API usability
- Frontend code must handle multiple response formats
- API is difficult to document
- Inconsistent developer experience

## Examples
``````javascript
// shows.js - Raw array
res.json(result.rows);

// episodes.js - Wrapped object
res.json({ success: true, count: result.rows.length, data: result.rows });

// characters.js - Different error format
return res.status(404).send({ message: 'Character not found', code: 'NOT_FOUND' });
``````

## Expected Behavior
All endpoints should use a consistent response format.

## Fix Suggestion
Standardize on one format, e.g., ``{ success, data, error }``
"@

$createdIssues += $issue9
Write-Host "✓ Created: Response format inconsistency" -ForegroundColor Green

# Bug 10: Mixed PUT/PATCH
$issue10 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] Inconsistent use of PUT vs PATCH for update operations" `
  --label "bug" `
  --label "high-priority" `
  --body @"
## Bug Description
Different route files use different HTTP methods (PUT vs PATCH) for update operations.

## Location
Multiple route files

## Impact
⚠️ **HIGH** - REST API consistency
- shows.js uses PUT
- characters.js uses PATCH
- episodes.js uses PUT
- quotes.js uses PUT

## Evidence
``````javascript
// characters.js line 118
router.patch('/:id', async (req, res) => {

// shows.js line 87
router.put('/:id', async (req, res, next) => {
``````

## Expected Behavior
Consistently use either PUT (full replacement) or PATCH (partial update) across all routes.

## Fix Suggestion
Decide on PUT or PATCH and update all routes to match.
"@

$createdIssues += $issue10
Write-Host "✓ Created: PUT vs PATCH inconsistency" -ForegroundColor Green

# Bug 11: CORS wide open
$issue11 = gh issue create `
  --repo "$owner/$repo" `
  --title "[SECURITY] CORS enabled for all origins without restrictions" `
  --label "bug" `
  --label "security" `
  --label "high-priority" `
  --body @"
## Bug Description
CORS is enabled for all origins with no restrictions.

## Location
``````
fanhub/backend/src/index.js (line 13)
``````

## Impact
⚠️ **HIGH** - Security risk
- Any website can make requests to the API
- Potential for CSRF attacks
- Production deployment would be vulnerable

## Evidence
``````javascript
app.use(cors()); // TODO: Configure properly for production
``````

## Expected Behavior
CORS should be restricted to specific allowed origins in production.

## Fix Suggestion
Configure CORS with allowed origins:
``````javascript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000'
}));
``````
"@

$createdIssues += $issue11
Write-Host "✓ Created: CORS security issue" -ForegroundColor Green

# Bug 12: Exposed error details
$issue12 = gh issue create `
  --repo "$owner/$repo" `
  --title "[SECURITY] Database error messages exposed to client" `
  --label "bug" `
  --label "security" `
  --label "high-priority" `
  --body @"
## Bug Description
Error messages from database are exposed directly to clients in all environments.

## Location
``````
fanhub/backend/src/routes/characters.js (line 113)
``````

## Impact
⚠️ **HIGH** - Information disclosure
- Database structure exposed through error messages
- Potential SQL injection clues revealed
- Should only show details in development mode

## Evidence
``````javascript
res.status(500).json({ error: error.message }); // Exposing error details!
``````

## Fix Suggestion
Only expose error details in development:
``````javascript
res.status(500).json({ 
  error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
});
``````
"@

$createdIssues += $issue12
Write-Host "✓ Created: Exposed error details" -ForegroundColor Green

# Bug 13: Missing input validation
$issue13 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] Missing input validation for ID parameters and user input" `
  --label "bug" `
  --label "high-priority" `
  --body @"
## Bug Description
No validation for ID parameters (should be numeric), required fields, or text field lengths.

## Location
Multiple route files

## Impact
⚠️ **HIGH** - Data integrity and security
- Invalid IDs could cause database errors
- No sanitization of search inputs
- No length limits on text fields could cause issues

## Evidence
``````javascript
// characters.js line 52 - No validation that id is a number
const characterResult = await query(
  'SELECT * FROM characters WHERE id = \$1',
  [req.params.id]  // Could be anything!
);
``````

## Fix Suggestion
Add input validation middleware or validation in each route.
"@

$createdIssues += $issue13
Write-Host "✓ Created: Missing input validation" -ForegroundColor Green

# Bug 14: Unused auth middleware
$issue14 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] Auth middleware defined but never used - no routes protected" `
  --label "bug" `
  --label "high-priority" `
  --body @"
## Bug Description
``authMiddleware`` and ``adminMiddleware`` are defined but never applied to any routes.

## Location
``````
fanhub/backend/src/routes/auth.js (lines 175-199)
``````

## Impact
⚠️ **HIGH** - Security gap
- No routes are protected
- Anyone can access all endpoints
- Comment says "NOT USED YET"

## Evidence
``````javascript
// Middleware for protected routes - NOT USED YET
// Export it for other routes to use... eventually
function authMiddleware(req, res, next) {
``````

## Fix Suggestion
Apply middleware to routes that should require authentication.
"@

$createdIssues += $issue14
Write-Host "✓ Created: Unused auth middleware" -ForegroundColor Green

# Bug 15: No pagination
$issue15 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] No pagination on list endpoints - potential performance issue" `
  --label "bug" `
  --label "high-priority" `
  --label "performance" `
  --body @"
## Bug Description
List endpoints return ALL records with no pagination limits.

## Location
``/api/characters``, ``/api/episodes``, ``/api/shows``

## Impact
⚠️ **HIGH** - Performance risk
- Could cause slow responses with large datasets
- Frontend receives too much data at once
- No way to limit results

## Fix Suggestion
Implement pagination with ``limit`` and ``offset`` parameters:
``````javascript
const limit = parseInt(req.query.limit) || 50;
const offset = parseInt(req.query.offset) || 0;
``````
"@

$createdIssues += $issue15
Write-Host "✓ Created: No pagination" -ForegroundColor Green

# ===== MEDIUM PRIORITY BUGS =====
Write-Host ""
Write-Host "Creating MEDIUM priority bugs..." -ForegroundColor Cyan

# Bug 16: Mixed component patterns
$issue16 = gh issue create `
  --repo "$owner/$repo" `
  --title "[CODE QUALITY] Inconsistent React component patterns (class vs functional)" `
  --label "bug" `
  --label "code-quality" `
  --body @"
## Bug Description
Frontend components use mixed patterns - some class components, some functional with hooks.

## Location
``fanhub/frontend/src/pages/`` and ``fanhub/frontend/src/components/``

## Impact
- Inconsistent codebase
- Harder to maintain
- Confusing for new developers

## Examples
- **Class Components**: Characters.jsx, Footer.js
- **Functional with Hooks**: Episodes.js, Home.jsx, Header.jsx, CharacterCard.jsx

## Fix Suggestion
Standardize on functional components with hooks (modern React pattern).
"@

$createdIssues += $issue16
Write-Host "✓ Created: Component pattern inconsistency" -ForegroundColor Green

# Bug 17: Four styling approaches
$issue17 = gh issue create `
  --repo "$owner/$repo" `
  --title "[CODE QUALITY] Four different styling approaches used across codebase" `
  --label "bug" `
  --label "code-quality" `
  --body @"
## Bug Description
The codebase uses FOUR different styling methods, creating inconsistency.

## Location
``fanhub/frontend/src/``

## The Four Approaches
1. **Styled-components**: Home.jsx, Header.jsx, CharacterCard.jsx
2. **Inline style objects**: Characters.jsx, Episodes.js, Footer.js, EpisodeList.js
3. **CSS Modules**: QuoteDisplay.jsx with QuoteDisplay.module.css
4. **Style tag injection**: About.jsx (worst practice!)

## Impact
- Difficult to maintain
- Inconsistent developer experience
- Style conflicts possible
- Larger bundle size

## Fix Suggestion
Choose one approach (recommend styled-components) and refactor all components to use it.
"@

$createdIssues += $issue17
Write-Host "✓ Created: Styling approach inconsistency" -ForegroundColor Green

# Bug 18: File extension inconsistency
$issue18 = gh issue create `
  --repo "$owner/$repo" `
  --title "[CODE QUALITY] Inconsistent file extensions (.js vs .jsx) for React components" `
  --label "bug" `
  --label "code-quality" `
  --body @"
## Bug Description
Mixed file extensions for React components with no clear pattern.

## Location
``fanhub/frontend/src/``

## Examples
- **.jsx**: Header.jsx, Characters.jsx, Home.jsx, About.jsx, CharacterCard.jsx, QuoteDisplay.jsx
- **.js**: Episodes.js, Footer.js, EpisodeList.js, App.js

## Impact
- Looks unprofessional
- Harder to identify React components
- No consistent convention

## Fix Suggestion
Use .jsx for all files containing JSX, or use .js for all (modern bundlers support both).
"@

$createdIssues += $issue18
Write-Host "✓ Created: File extension inconsistency" -ForegroundColor Green

# Bug 19: Mixed promise handling
$issue19 = gh issue create `
  --repo "$owner/$repo" `
  --title "[CODE QUALITY] Mixed async/await and .then() promise handling in same file" `
  --label "bug" `
  --label "code-quality" `
  --body @"
## Bug Description
``episodes.js`` route file mixes async/await and .then() promise handling.

## Location
``fanhub/backend/src/routes/episodes.js``

## Examples
- GET ``/``: Uses ``.then().catch()`` (lines 44-52)
- GET ``/:id``: Uses ``async/await`` (lines 56-108)
- POST ``/``: Uses ``.then().catch()`` (lines 138-142)
- DELETE ``/:id``: Uses ``.then().catch()`` (lines 182-189)

## Impact
- Inconsistent code style
- Harder to read and maintain
- Different error handling patterns

## Fix Suggestion
Refactor all routes to use async/await consistently.
"@

$createdIssues += $issue19
Write-Host "✓ Created: Promise handling inconsistency" -ForegroundColor Green

# Bug 20: Inconsistent database imports
$issue20 = gh issue create `
  --repo "$owner/$repo" `
  --title "[CODE QUALITY] Database connection imported with different names across files" `
  --label "bug" `
  --label "code-quality" `
  --body @"
## Bug Description
Different route files import the database connection with different variable names.

## Location
Route files

## Examples
- ``characters.js``: ``const { query } = require('../database/connection');``
- ``episodes.js``: ``const database = require('../database/connection');``
- ``shows.js``: ``const db = require('../database/connection');``
- ``quotes.js``: ``const db = require('../database/connection');``

## Impact
- Inconsistent naming makes code harder to understand
- Could lead to confusion when debugging

## Fix Suggestion
Standardize on one import style, e.g., ``const db = require(...)``
"@

$createdIssues += $issue20
Write-Host "✓ Created: Database import naming" -ForegroundColor Green

# Bug 21: Inconsistent route naming
$issue21 = gh issue create `
  --repo "$owner/$repo" `
  --title "[CODE QUALITY] Inconsistent route variable naming" `
  --label "bug" `
  --label "code-quality" `
  --body @"
## Bug Description
Route imports use inconsistent naming convention.

## Location
``fanhub/backend/src/index.js`` (lines 23-27)

## Evidence
``````javascript
const showsRouter = require('./routes/shows');
const charactersRouter = require('./routes/characters');
const episodesRoutes = require('./routes/episodes'); // Different!
const quotesRouter = require('./routes/quotes');
const authRoutes = require('./routes/auth'); // Different!
``````

## Fix Suggestion
Use consistent naming: all should end with ``Router`` or all with ``Routes``.
"@

$createdIssues += $issue21
Write-Host "✓ Created: Route naming inconsistency" -ForegroundColor Green

# Bug 22: Mixed error response formats
$issue22 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] Error responses use different structures across routes" `
  --label "bug" `
  --label "code-quality" `
  --body @"
## Bug Description
Different error message structures across the API.

## Location
Multiple route files

## Examples
- ``{ error: 'message' }``
- ``{ message: 'text', code: 'CODE' }``
- ``{ success: false, message: 'text' }``
- ``{ success: false, errors: [...] }`` (array)
- Plain text string

## Impact
- Frontend must handle multiple error formats
- Inconsistent error handling

## Fix Suggestion
Standardize error response format across all routes.
"@

$createdIssues += $issue22
Write-Host "✓ Created: Error response format inconsistency" -ForegroundColor Green

# Bug 23: Inconsistent function declarations
$issue23 = gh issue create `
  --repo "$owner/$repo" `
  --title "[CODE QUALITY] Mixed function declaration styles in route handlers" `
  --label "bug" `
  --label "code-quality" `
  --body @"
## Bug Description
Route handlers use three different function declaration styles.

## Location
Route files

## Examples
``````javascript
// Arrow functions
router.get('/', async (req, res) => {

// Function keyword
router.get('/:id', async function(req, res, next) {

// Old-style
router.post('/', function(req, res) {
``````

## Fix Suggestion
Standardize on arrow functions for route handlers.
"@

$createdIssues += $issue23
Write-Host "✓ Created: Function declaration inconsistency" -ForegroundColor Green

# Bug 24: No request ID logging
$issue24 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] Request logging lacks correlation IDs for debugging" `
  --label "bug" `
  --label "observability" `
  --body @"
## Bug Description
Basic request logging with no request IDs or correlation tracking.

## Location
``fanhub/backend/src/index.js`` (lines 17-20)

## Impact
- Debugging concurrent requests is difficult
- No way to trace a request through logs
- Poor observability

## Evidence
``````javascript
app.use((req, res, next) => {
  console.log(\`\${new Date().toISOString()} \${req.method} \${req.path}\`);
  next();
});
``````

## Fix Suggestion
Add request ID middleware (use uuid) for correlation.
"@

$createdIssues += $issue24
Write-Host "✓ Created: Request logging issue" -ForegroundColor Green

# Bug 25: SQL injection risk
$issue25 = gh issue create `
  --repo "$owner/$repo" `
  --title "[CODE QUALITY] Confusing dynamic SQL query building pattern" `
  --label "bug" `
  --label "code-quality" `
  --body @"
## Bug Description
Dynamic query building uses same parameter twice but only pushes once - confusing pattern.

## Location
``fanhub/backend/src/routes/characters.js`` (line 38)

## Evidence
``````javascript
if (search) {
  paramCount++;
  sql += \` AND (name ILIKE \$\${paramCount} OR actor_name ILIKE \$\${paramCount})\`;
  params.push(\`%\${search}%\`); // Same param used twice!
}
``````

Note: This actually works but is confusing and error-prone.

## Fix Suggestion
Either push parameter twice or restructure query for clarity.
"@

$createdIssues += $issue25
Write-Host "✓ Created: SQL query building pattern" -ForegroundColor Green

# Bug 26: No pool management
$issue26 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] Database connection pool not properly configured or closed" `
  --label "bug" `
  --label "performance" `
  --body @"
## Bug Description
Connection pool created but never properly closed, no size configuration, no timeout settings.

## Location
``fanhub/backend/src/database/connection.js``

## Impact
- Pool size defaults may not be optimal
- No graceful shutdown
- Potential connection leaks

## Fix Suggestion
Add pool configuration and graceful shutdown:
``````javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

process.on('SIGTERM', async () => {
  await pool.end();
});
``````
"@

$createdIssues += $issue26
Write-Host "✓ Created: Pool management issue" -ForegroundColor Green

# Bug 27: Inconsistent module exports
$issue27 = gh issue create `
  --repo "$owner/$repo" `
  --title "[CODE QUALITY] Unnecessary dual module export style" `
  --label "bug" `
  --label "code-quality" `
  --body @"
## Bug Description
Database connection exports both CommonJS and a default export "for ESM-style imports".

## Location
``fanhub/backend/src/database/connection.js`` (lines 42-49)

## Evidence
``````javascript
module.exports = {
  query,
  getClient,
  pool,
};

// Also export as default for ESM-style imports (inconsistent!)
module.exports.default = { query, getClient, pool };
``````

## Impact
- Unnecessary complexity
- Confusing for developers
- Not actually using ESM

## Fix Suggestion
Remove the default export since we're using CommonJS throughout.
"@

$createdIssues += $issue27
Write-Host "✓ Created: Module export inconsistency" -ForegroundColor Green

# Bug 28: Client not released warning
$issue28 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] Transaction helper has warning but no safeguards for client release" `
  --label "bug" `
  --label "code-quality" `
  --body @"
## Bug Description
``getClient()`` function has warning comment but no safeguards to ensure client is released.

## Location
``fanhub/backend/src/database/connection.js`` (lines 35-39)

## Evidence
``````javascript
// WARNING: Make sure to release the client!
async function getClient() {
  const client = await pool.connect();
  return client;
}
``````

## Impact
- Risk of connection leaks if developers forget to release
- No helper for transaction patterns

## Fix Suggestion
Provide a transaction helper that handles release automatically:
``````javascript
async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
``````
"@

$createdIssues += $issue28
Write-Host "✓ Created: Transaction helper issue" -ForegroundColor Green

# Bug 29: Date formatting in component
$issue29 = gh issue create `
  --repo "$owner/$repo" `
  --title "[PERFORMANCE] Helper function redefined on every component render" `
  --label "bug" `
  --label "performance" `
  --body @"
## Bug Description
``formatDate`` helper function is defined inside component, causing it to be recreated on every render.

## Location
``fanhub/frontend/src/components/EpisodeList.js`` (lines 84-92)

## Evidence
``````javascript
function EpisodeList({ episodes, onEpisodeClick }) {
  // Helper function - defined inside component (not ideal)
  const formatDate = (dateString) => {
    ...
  };
``````

## Impact
- Slight performance overhead
- Could cause issues with memoization

## Fix Suggestion
Move outside component or use ``useCallback`` hook.
"@

$createdIssues += $issue29
Write-Host "✓ Created: Function recreation performance" -ForegroundColor Green

# Bug 30: No env validation
$issue30 = gh issue create `
  --repo "$owner/$repo" `
  --title "[SECURITY] No environment variable validation - silent fallback to insecure defaults" `
  --label "bug" `
  --label "security" `
  --body @"
## Bug Description
No validation that required environment variables are set - falls back to defaults silently.

## Location
Multiple files

## Impact
- Could deploy to production with dev secrets
- Hard-to-debug issues when env vars are wrong
- Security risk

## Evidence
``````javascript
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_not_for_production';
``````

## Fix Suggestion
Fail loudly in production if critical env vars are missing:
``````javascript
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in production');
}
``````
"@

$createdIssues += $issue30
Write-Host "✓ Created: Environment validation" -ForegroundColor Green

# Bug 31: Footer links wrong
$issue31 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] Footer links use <a> tags instead of React Router causing page reloads" `
  --label "bug" `
  --label "ux" `
  --body @"
## Bug Description
Footer uses ``<a>`` tags instead of React Router ``<Link>``, causing full page reloads.

## Location
``fanhub/frontend/src/components/Footer.js`` (lines 44-48)

## Impact
- Poor user experience
- Loses application state
- Slower navigation

## Evidence
``````javascript
<a href="/about" style={linkStyle}>About</a>
<a href="/privacy" style={linkStyle}>Privacy</a>
``````

## Fix Suggestion
Use React Router's ``Link`` component:
``````javascript
import { Link } from 'react-router-dom';
<Link to="/about" style={linkStyle}>About</Link>
``````
"@

$createdIssues += $issue31
Write-Host "✓ Created: Footer navigation issue" -ForegroundColor Green

# Bug 32: No loading state for quote like
$issue32 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] Quote like handler has no loading state or error handling" `
  --label "bug" `
  --label "ux" `
  --body @"
## Bug Description
Quote like handler has no loading state, no error handling, and doesn't use the result.

## Location
``fanhub/frontend/src/pages/Home.jsx`` (line 123)

## Evidence
``````javascript
const handleQuoteLike = async (quoteId) => {
  await quotesApi.like(quoteId);
};
``````

## Impact
- User gets no feedback when clicking like
- Errors fail silently
- Like count doesn't update

## Fix Suggestion
Add loading state and error handling.
"@

$createdIssues += $issue32
Write-Host "✓ Created: Quote like handler issue" -ForegroundColor Green

# ===== CONFIGURATION ISSUES =====
Write-Host ""
Write-Host "Creating CONFIGURATION issues..." -ForegroundColor Magenta

# Bug 33: Different JWT secrets
$issue33 = gh issue create `
  --repo "$owner/$repo" `
  --title "[CONFIG] Different JWT secret placeholders in docker-compose vs .env.example" `
  --label "bug" `
  --label "configuration" `
  --body @"
## Bug Description
Different placeholder JWT secrets could cause confusion.

## Location
``docker-compose.yml`` vs ``.env.example``

## Evidence
``````yaml
# docker-compose.yml
JWT_SECRET: dev_secret_change_in_production

# .env.example
JWT_SECRET=change_this_in_production
``````

## Fix Suggestion
Use the same placeholder value in both files.
"@

$createdIssues += $issue33
Write-Host "✓ Created: JWT secret config" -ForegroundColor Green

# Bug 34: No .env file
$issue34 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] Missing .env file causes database connection failures for new users" `
  --label "bug" `
  --label "setup" `
  --body @"
## Bug Description
Only ``.env.example`` exists - users must manually create ``.env`` file.

## Impact
- New users get "database not found" errors
- No mention in setup documentation
- Poor onboarding experience

## Fix Suggestion
Add setup script or clear instructions to copy .env.example to .env.
"@

$createdIssues += $issue34
Write-Host "✓ Created: Missing .env file" -ForegroundColor Green

# Bug 35: No production dockerfile
$issue35 = gh issue create `
  --repo "$owner/$repo" `
  --title "[BUG] Dockerfiles only support development mode, no production builds" `
  --label "bug" `
  --label "deployment" `
  --body @"
## Bug Description
Both Dockerfiles use development mode with no optimized production builds.

## Location
``fanhub/backend/Dockerfile`` and ``fanhub/frontend/Dockerfile``

## Evidence
``````dockerfile
CMD ["npm", "run", "dev"]  # Backend
CMD ["npm", "start"]       # Frontend - also development
``````

## Impact
- Cannot create production-ready containers
- Larger image sizes
- Development dependencies included

## Fix Suggestion
Create separate Dockerfile.prod for production builds with multi-stage builds.
"@

$createdIssues += $issue35
Write-Host "✓ Created: Production dockerfile" -ForegroundColor Green

# ===== MISSING FEATURES =====
Write-Host ""
Write-Host "Creating MISSING FEATURE issues..." -ForegroundColor Blue

# Missing features as enhancements
$issue36 = gh issue create `
  --repo "$owner/$repo" `
  --title "[FEATURE] Add favicon to application" `
  --label "enhancement" `
  --body @"
## Description
Application is missing a favicon.

## Location
``fanhub/frontend/public/index.html`` (line 9)

## TODO Comment
``<!-- TODO: Add favicon -->``
"@

$createdIssues += $issue36
Write-Host "✓ Created: Missing favicon" -ForegroundColor Green

$issue37 = gh issue create `
  --repo "$owner/$repo" `
  --title "[FEATURE] Implement dark mode support" `
  --label "enhancement" `
  --body @"
## Description
Application lacks dark mode support.

## Location
``fanhub/frontend/src/styles/global.css`` (line 43)

## TODO Comment
``/* TODO: Add dark mode support */``
"@

$createdIssues += $issue37
Write-Host "✓ Created: Dark mode feature" -ForegroundColor Green

$issue38 = gh issue create `
  --repo "$owner/$repo" `
  --title "[FEATURE] Make UI fully responsive" `
  --label "enhancement" `
  --body @"
## Description
UI needs responsive design improvements.

## Location
``fanhub/frontend/src/styles/global.css`` (line 44)

## TODO Comment
``/* TODO: Make responsive */``
"@

$createdIssues += $issue38
Write-Host "✓ Created: Responsive design" -ForegroundColor Green

$issue39 = gh issue create `
  --repo "$owner/$repo" `
  --title "[FEATURE] Create character detail page" `
  --label "enhancement" `
  --body @"
## Description
Character detail page not implemented - clicking characters shows alert.

## Location
``fanhub/frontend/src/pages/Characters.jsx`` (line 137)

## Current Behavior
``````javascript
alert(\`Character detail page not implemented yet!\nCharacter: \${character.name}\`);
``````
"@

$createdIssues += $issue39
Write-Host "✓ Created: Character detail page" -ForegroundColor Green

$issue40 = gh issue create `
  --repo "$owner/$repo" `
  --title "[FEATURE] Create episode detail page" `
  --label "enhancement" `
  --body @"
## Description
Episode detail page not implemented - clicking episodes shows alert.

## Location
``fanhub/frontend/src/pages/Episodes.js`` (line 137)

## Current Behavior
``````javascript
alert(\`Episode detail page not implemented yet!\nEpisode: \${episode.title}\`);
``````
"@

$createdIssues += $issue40
Write-Host "✓ Created: Episode detail page" -ForegroundColor Green

$issue41 = gh issue create `
  --repo "$owner/$repo" `
  --title "[TESTING] Add test coverage for backend and frontend" `
  --label "testing" `
  --body @"
## Description
No tests configured for either backend or frontend.

## Current State
- Backend: ``npm test`` returns placeholder message
- Frontend: Test files don't exist
- No CI/CD pipeline

## Needed
- Unit tests for API routes
- Integration tests for database operations
- Frontend component tests
- E2E tests for critical flows
"@

$createdIssues += $issue41
Write-Host "✓ Created: Testing feature" -ForegroundColor Green

$issue42 = gh issue create `
  --repo "$owner/$repo" `
  --title "[CI/CD] Set up GitHub Actions pipeline" `
  --label "ci-cd" `
  --body @"
## Description
No CI/CD pipeline exists for the project.

## Location
``.github/workflows/`` directory doesn't exist

## Needed
- Run tests on PR
- Lint code
- Build Docker images
- Deploy to staging/production
"@

$createdIssues += $issue42
Write-Host "✓ Created: CI/CD pipeline" -ForegroundColor Green

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "✓ Successfully created $($createdIssues.Count) GitHub issues!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Created issues:" -ForegroundColor Cyan
$createdIssues | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
