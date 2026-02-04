# FanHub Known Bugs & Issues

> **Purpose**: This document catalogs intentional bugs, misconfigurations, and code quality issues in the FanHub workshop starter project. These are designed for learning purposes - participants will fix them using AI-assisted development techniques.

---

## 🔴 Critical Bugs

### 1. **Duplicate Character Data in Seed File**
**Location**: `src/backend/src/database/seed.sql` (lines 36 and 39)
**Type**: Data Integrity Bug
**Impact**: Page-breaking

**Description**: 
- Jesse Pinkman appears TWICE in the characters table with different IDs (2 and 5)
- Both entries have slightly different bio text
- Quotes reference different Jesse IDs inconsistently
- This causes duplicate characters to appear in the UI
- Related data (quotes, episode appearances) is split between two records

**Evidence**:
```sql
-- Line 36
(1, 'Jesse Pinkman', 'Aaron Paul', 'Walt''s former student and business partner...', true, 'alive'),
-- Line 39 - DUPLICATE!
(1, 'Jesse Pinkman', 'Aaron Paul', 'Walt''s former student and partner in the methamphetamine business.', true, 'alive'),
```

**User Impact**: 
- Characters page shows two Jesse Pinkman cards
- Character detail pages would show incomplete data
- Quotes are split between the two records

---

### 2. **Episode Cache Ignores Season Filter**
**Location**: `src/frontend/src/pages/Episodes.js` (lines 76-84)
**Type**: Logic Bug
**Impact**: Data Display Bug

**Description**:
- Cache is used regardless of which season was requested
- When user filters by season, they might see ALL episodes from cache
- Cache key doesn't account for `seasonId` parameter

**Evidence**:
```javascript
// BUG: Using cached data regardless of which season was requested
if (episodeCache && cacheTimestamp && (now - cacheTimestamp) < 30000) {
  setEpisodes(episodeCache);  // Returns ALL episodes, not filtered ones!
  setLoading(false);
  return;
}
```

**User Impact**:
- Season filter appears broken
- Clicking "Season 2" might show Season 1 episodes from cache
- Inconsistent behavior based on timing

---

### 3. **Inconsistent API Path Structure**
**Location**: `src/backend/src/index.js` (lines 30-34)
**Type**: API Design Bug
**Impact**: Developer Experience

**Description**:
- Most routes use `/api/*` prefix
- Auth routes use `/auth` (no `/api` prefix)
- Creates confusion and inconsistent API design

**Evidence**:
```javascript
app.use('/api/shows', showsRouter);
app.use('/api/characters', charactersRouter);
app.use('/api/episodes', episodesRoutes);
app.use('/api/quotes', quotesRouter);
app.use('/auth', authRoutes);  // INCONSISTENT - no /api prefix!
```

**User Impact**:
- Developers must remember two different URL patterns
- API documentation is confusing
- Frontend code mixes paths (`/api/characters` vs `/auth/login`)

---

## ⚠️ High Priority Issues

### 4. **Missing Error Handling in Characters Route**
**Location**: `src/backend/src/routes/characters.js` (lines 10-45)
**Type**: Error Handling Bug

**Description**:
- GET `/api/characters` endpoint has no try/catch block
- Database errors will crash the endpoint
- Other routes in same file DO have error handling (inconsistent)

**Evidence**:
```javascript
router.get('/', async (req, res) => {
  // No try/catch here - inconsistent error handling!
  const result = await query(sql, params);
  res.json(result.rows);
});
```

**User Impact**:
- Unhandled promise rejection if database query fails
- User sees generic 500 error with no helpful message

---

### 5. **DELETE Operations Without Try/Catch**
**Location**: `src/backend/src/routes/characters.js` (lines 158-168)
**Type**: Error Handling Bug

**Description**:
- DELETE endpoint has no error handling
- Database errors will cause unhandled promise rejection

**Evidence**:
```javascript
router.delete('/:id', async (req, res) => {
  // No try/catch - just gone if it fails!
  const result = await query('DELETE FROM characters WHERE id = $1...', [req.params.id]);
```

---

### 6. **Mixed HTTP Status Codes for Create Operations**
**Location**: Multiple route files
**Type**: API Consistency Bug

**Description**:
- `shows.js`: POST returns 201 (correct)
- `characters.js`: POST returns 200 (incorrect - should be 201)
- `episodes.js`: POST returns 201 (correct)
- `quotes.js`: POST returns 201 (correct)

**Evidence**:
```javascript
// characters.js line 110
res.json(result.rows[0]);  // Default 200, not 201!

// shows.js line 80
res.status(201).json(result.rows[0]);  // Correct!
```

---

### 7. **Weak Password Requirements**
**Location**: `src/backend/src/routes/auth.js` (line 27)
**Type**: Security Bug

**Description**:
- Password only requires 6 characters minimum
- No complexity requirements
- Comment acknowledges it should be stronger

**Evidence**:
```javascript
// Password requirements - should be stronger!
if (password.length < 6) {
```

**User Impact**:
- Users can create weak passwords like "123456"
- Security vulnerability

---

### 8. **Invalid Bcrypt Hash in Seed Data**
**Location**: `src/backend/src/database/seed.sql` (line 65)
**Type**: Authentication Bug

**Description**:
- Admin user seed has an invalid bcrypt hash
- Hash is clearly fake/placeholder
- Admin login will fail

**Evidence**:
```sql
-- Password hash is bcrypt of 'admin123'
INSERT INTO users (email, password_hash, username, display_name, role) VALUES
('admin@fanhub.test', '$2b$10$rQZ5QZQZ5QZQZ5QZQZ5QZOeH5H5H5H5H5H5H5H5H5H5H5H5H5H5H5', 'admin', 'Admin User', 'admin');
```
Note: This is clearly a fake hash (repeating pattern).

---

### 9. **Inconsistent Response Formats Across Endpoints**
**Location**: Multiple files
**Type**: API Design Bug

**Description**:
Different endpoints return different response structures:
- `shows.js`: Returns raw array `[...]` or object `{...}`
- `episodes.js`: Returns `{ success: true, data: [...] }`
- `characters.js`: Mixes formats - sometimes `{ message, code }`, sometimes raw
- `quotes.js`: Returns raw array/object

**Examples**:
```javascript
// shows.js
res.json(result.rows);  // Raw array

// episodes.js  
res.json({ success: true, count: result.rows.length, data: result.rows });

// characters.js
return res.status(404).send({ message: 'Character not found', code: 'NOT_FOUND' });
```

---

## 🟡 Medium Priority Issues

### 10. **Mixed Update Methods (PUT vs PATCH)**
**Location**: Multiple route files
**Type**: REST API Consistency

**Description**:
- `shows.js`: Uses PUT for updates
- `characters.js`: Uses PATCH for updates
- `episodes.js`: Uses PUT for updates
- `quotes.js`: Uses PUT for updates

**Evidence**:
```javascript
// characters.js line 118
router.patch('/:id', async (req, res) => {

// shows.js line 87
router.put('/:id', async (req, res, next) => {
```

---

### 11. **Inconsistent Coding Patterns (Class vs Functional Components)**
**Location**: `src/frontend/src/pages/` and `src/frontend/src/components/`
**Type**: Code Style Inconsistency

**Description**:
Frontend components use mixed patterns:
- **Class Components**: `Characters.jsx` (page), `Footer.js` (component)
- **Functional with Hooks**: `Episodes.js`, `Home.jsx`, `Header.jsx`, `CharacterCard.jsx`
- No consistent pattern across the codebase

**Evidence**:
```javascript
// Characters.jsx - Class component
class Characters extends React.Component {

// Header.jsx - Functional component
const Header = () => {

// Footer.js - Class component
class Footer extends Component {
```

---

### 12. **Four Different Styling Approaches**
**Location**: `src/frontend/src/`
**Type**: Architecture Inconsistency

**Description**:
The codebase uses FOUR different styling methods:
1. **Styled-components**: `Home.jsx`, `Header.jsx`, `CharacterCard.jsx`
2. **Inline styles as objects**: `Characters.jsx`, `Episodes.js`, `Footer.js`, `EpisodeList.js`
3. **CSS Modules**: `QuoteDisplay.jsx` with `QuoteDisplay.module.css`
4. **Style tag injection**: `About.jsx` (worst practice!)

**Examples**:
```javascript
// Approach 1: styled-components
const Title = styled.h1`
  font-size: 3rem;
`;

// Approach 2: inline style objects
const styles = {
  container: { padding: '1rem 0' }
};

// Approach 3: CSS modules
import styles from '../styles/QuoteDisplay.module.css';

// Approach 4: Style tag (DO NOT DO THIS!)
const AboutStyles = () => (<style>{`...`}</style>);
```

---

### 13. **File Extension Inconsistency (.js vs .jsx)**
**Location**: `src/frontend/src/`
**Type**: Code Organization

**Description**:
Mixed file extensions for React components:
- `.jsx`: `Header.jsx`, `Characters.jsx`, `Home.jsx`, `About.jsx`, `CharacterCard.jsx`, `QuoteDisplay.jsx`
- `.js`: `Episodes.js`, `Footer.js`, `EpisodeList.js`, `App.js`

No clear pattern - appears random.

---

### 14. **Inconsistent Promise Handling (async/await vs .then())**
**Location**: `src/backend/src/routes/episodes.js`
**Type**: Code Style Inconsistency

**Description**:
Same file mixes async/await and .then() promise handling:
- GET `/`: Uses `.then().catch()` (lines 44-52)
- GET `/:id`: Uses `async/await` (lines 56-108)
- POST `/`: Uses `.then().catch()` (lines 138-142)
- DELETE `/:id`: Uses `.then().catch()` (lines 182-189)

**Evidence**:
```javascript
// Line 44 - .then() style
database.query(query, params)
  .then(result => {
    res.json({...});
  })
  .catch(error => handleError(res, error, 'Failed to fetch episodes'));

// Line 56 - async/await style
router.get('/:id', async (req, res) => {
  try {
    const episodeResult = await database.query(...);
```

---

### 15. **Inconsistent Database Import Naming**
**Location**: Route files
**Type**: Code Consistency

**Description**:
Different route files import the database connection with different names:
- `characters.js`: `const { query } = require('../database/connection');`
- `episodes.js`: `const database = require('../database/connection');`
- `shows.js`: `const db = require('../database/connection');`
- `quotes.js`: `const db = require('../database/connection');`

---

### 16. **Inconsistent Variable Naming in Routes**
**Location**: `src/backend/src/index.js` (lines 23-27)
**Type**: Code Style

**Description**:
Route imports use inconsistent naming:
- `showsRouter`
- `charactersRouter`
- `episodesRoutes` (plural "Routes" instead of "Router")
- `quotesRouter`
- `authRoutes` (plural "Routes")

**Evidence**:
```javascript
const showsRouter = require('./routes/shows');
const charactersRouter = require('./routes/characters');
const episodesRoutes = require('./routes/episodes'); // Different!
const quotesRouter = require('./routes/quotes');
const authRoutes = require('./routes/auth'); // Different!
```

---

### 17. **Mixed Error Response Formats**
**Location**: Multiple route files
**Type**: Error Handling Inconsistency

**Description**:
Different error message structures:
- `{ error: 'message' }`
- `{ message: 'text', code: 'CODE' }`
- `{ success: false, message: 'text' }`
- `{ success: false, errors: [...] }` (array)
- Plain text string

**Examples**:
```javascript
// characters.js
return res.status(400).send('show_id and name are required'); // Plain text!

// episodes.js
return res.status(400).json({ success: false, errors: errors }); // Array of errors

// shows.js
return res.status(400).json({ error: 'Title is required' }); // Single error
```

---

### 18. **Exposed Error Details in Production**
**Location**: `src/backend/src/routes/characters.js` (line 113)
**Type**: Security Bug

**Description**:
Database error messages exposed to client in all environments:
```javascript
res.status(500).json({ error: error.message }); // Exposing error details!
```

Should only show error details in development mode.

---

### 19. **Missing Input Validation**
**Location**: Multiple route files
**Type**: Security/Data Validation

**Description**:
- No validation for ID parameters (should be numeric)
- No validation for required fields consistency
- No sanitization of search inputs
- No length limits on text fields

**Example**:
```javascript
// characters.js line 52 - No validation that id is a number
const characterResult = await query(
  'SELECT * FROM characters WHERE id = $1',
  [req.params.id]  // Could be anything!
);
```

---

### 20. **CORS Wide Open**
**Location**: `src/backend/src/index.js` (line 13)
**Type**: Security Configuration

**Description**:
CORS is enabled for all origins with no restrictions:
```javascript
app.use(cors()); // TODO: Configure properly for production
```

Should be restricted to specific origins in production.

---

### 21. **Unused Auth Middleware**
**Location**: `src/backend/src/routes/auth.js` (lines 175-199)
**Type**: Implementation Gap

**Description**:
- `authMiddleware` and `adminMiddleware` are defined but never used
- No routes are protected
- Comment says "NOT USED YET"

**Evidence**:
```javascript
// Middleware for protected routes - NOT USED YET
// Export it for other routes to use... eventually
function authMiddleware(req, res, next) {
```

---

### 22. **TODO Comments for Missing Auth Features**
**Location**: `src/backend/src/routes/auth.js` (lines 166-171)
**Type**: Implementation Gap

**Description**:
Multiple auth features are listed as TODO but not implemented:
- Logout endpoint
- Token refresh
- Forgot password
- Reset password
- Change password

---

### 23. **Inconsistent Function Declarations**
**Location**: Route files
**Type**: Code Style

**Description**:
Mixed function declaration styles in route handlers:
- Arrow functions: `router.get('/', async (req, res) => {`
- Function keyword: `router.get('/:id', async function(req, res, next) {`
- Old-style: `router.post('/', function(req, res) {`

**Evidence**:
```javascript
// characters.js line 49 - function keyword
router.get('/:id', async function(req, res, next) {

// characters.js line 84 - arrow function
router.post('/', async (req, res) => {
```

---

## 🟢 Low Priority / Code Quality Issues

### 24. **No Request ID for Logging**
**Location**: `src/backend/src/index.js` (lines 17-20)
**Type**: Observability Gap

**Description**:
Basic request logging with no request IDs or correlation:
```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});
```

Makes debugging concurrent requests difficult.

---

### 25. **No Pagination on List Endpoints**
**Location**: Multiple route files
**Type**: Performance/UX Gap

**Description**:
- `/api/characters`, `/api/episodes`, `/api/shows` return ALL records
- No page size limits
- Could cause performance issues with large datasets

---

### 26. **SQL Injection Risk in Dynamic Query Building**
**Location**: `src/backend/src/routes/characters.js` (line 38)
**Type**: Security Risk (Mitigated)

**Description**:
While parameterized queries ARE used (which is good), the pattern of dynamic query building could be error-prone:
```javascript
if (search) {
  paramCount++;
  sql += ` AND (name ILIKE $${paramCount} OR actor_name ILIKE $${paramCount})`;
  params.push(`%${search}%`);
}
```

The same parameter is referenced twice but only pushed once - this works but is confusing.

---

### 27. **No Database Connection Pool Management**
**Location**: `src/backend/src/database/connection.js`
**Type**: Performance/Scalability

**Description**:
- Pool is created but never properly closed
- No pool size configuration
- No connection timeout settings
- Comment says "consider connection pooling" but it's already using Pool

---

### 28. **Inconsistent Module Exports**
**Location**: `src/backend/src/database/connection.js` (lines 42-49)
**Type**: Code Quality

**Description**:
Exports both CommonJS and default for "ESM-style imports":
```javascript
module.exports = {
  query,
  getClient,
  pool,
};

// Also export as default for ESM-style imports (inconsistent!)
module.exports.default = { query, getClient, pool };
```

This is unnecessary and confusing.

---

### 29. **Client Not Released in Transactions**
**Location**: `src/backend/src/database/connection.js` (lines 35-39)
**Type**: Resource Leak Risk

**Description**:
`getClient()` function has warning comment but no safeguards:
```javascript
// WARNING: Make sure to release the client!
async function getClient() {
  const client = await pool.connect();
  return client;
}
```

Should use try/finally or provide helper for transactions.

---

### 30. **Date Formatting Function Defined Inside Component**
**Location**: `src/frontend/src/components/EpisodeList.js` (lines 84-92)
**Type**: Performance

**Description**:
Helper function is redefined on every render:
```javascript
function EpisodeList({ episodes, onEpisodeClick }) {
  // Helper function - defined inside component (not ideal)
  const formatDate = (dateString) => {
```

Should be moved outside component or use `useCallback`.

---

### 31. **Mixed Quote Usage in SQL**
**Location**: `src/backend/src/database/seed.sql`
**Type**: Code Style

**Description**:
SQL uses different quote escaping methods:
- `'Walt''s'` (correct SQL escaping)
- Some strings unnecessarily complex

Inconsistent but functional.

---

### 32. **No Environment Variable Validation**
**Location**: Multiple files
**Type**: Configuration Risk

**Description**:
- No validation that required env vars are set
- Fallback to defaults silently
- Could cause issues in production

**Example**:
```javascript
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_not_for_production';
```

Should fail loudly in production if JWT_SECRET is not set.

---

### 33. **Magic Numbers**
**Location**: Multiple files
**Type**: Code Quality

**Description**:
- Cache timeout: 30000 (should be named constant)
- Bcrypt rounds: 10 (should be configurable)
- Timeout: 10000 (should be named)
- Limits: 50 (should be configurable)

---

### 34. **Footer Links Don't Use React Router**
**Location**: `src/frontend/src/components/Footer.js` (lines 44-48)
**Type**: Functionality Bug

**Description**:
Footer uses `<a>` tags instead of React Router `<Link>`:
```javascript
<a href="/about" style={linkStyle}>About</a>
<a href="/privacy" style={linkStyle}>Privacy</a>
```

This causes full page reloads instead of client-side navigation.

---

### 35. **No Loading States for Quote Like**
**Location**: `src/frontend/src/pages/Home.jsx` (line 123)
**Type**: UX Gap

**Description**:
```javascript
const handleQuoteLike = async (quoteId) => {
  await quotesApi.like(quoteId);
};
```

No loading state, no error handling, result is not used.

---

### 36. **Mixed State Management**
**Location**: Frontend pages
**Type**: Architecture Gap

**Description**:
- Some state is local (useState)
- Some would benefit from context
- No global state management
- Props are passed multiple levels

---

## 📊 Configuration Issues

### 37. **Different JWT Secrets in Docker vs .env**
**Location**: `docker-compose.yml` vs `.env.example`
**Type**: Configuration Inconsistency

**Description**:
```yaml
# docker-compose.yml
JWT_SECRET: dev_secret_change_in_production

# .env.example  
JWT_SECRET=change_this_in_production
```

Different placeholder secrets could cause confusion.

---

### 38. **No .env File Created**
**Location**: Project root
**Type**: Setup Gap

**Description**:
- Only `.env.example` exists
- Users must manually create `.env`
- No mention in setup docs
- Could cause "database not found" errors

---

### 39. **No Production Dockerfile**
**Location**: `src/backend/` and `src/frontend/`
**Type**: Deployment Gap

**Description**:
Both Dockerfiles use development mode:
```dockerfile
CMD ["npm", "run", "dev"]  # Backend
CMD ["npm", "start"]       # Frontend - also development
```

No optimized production builds.

---

## 🔧 Missing Features (Documented as TODO)

### 40. **No Favicon**
**Location**: `src/frontend/public/index.html` (line 9)

### 41. **No Dark Mode**
**Location**: `src/frontend/src/styles/global.css` (line 43)

### 42. **No Responsive Design**
**Location**: `src/frontend/src/styles/global.css` (line 44)

### 43. **No Character Detail Page**
**Location**: `src/frontend/src/pages/Characters.jsx` (line 137)

### 44. **No Episode Detail Page**
**Location**: `src/frontend/src/pages/Episodes.js` (line 137)

### 45. **No Tests Configured**
**Location**: Both backend and frontend
- Backend: `npm test` returns placeholder
- Frontend: Test files don't exist

### 46. **No CI/CD Pipeline**
**Location**: `.github/workflows/` - directory doesn't exist

---

## 📝 Summary by Category

| Category | Count |
|----------|-------|
| **Critical Bugs** | 3 |
| **High Priority** | 15 |
| **Medium Priority** | 19 |
| **Low Priority** | 13 |
| **Configuration Issues** | 3 |
| **Missing Features** | 7 |
| **TOTAL** | **60** |

---

## 🎯 Workshop Learning Objectives

These bugs are **intentionally designed** to teach:

1. **Data integrity** - Finding and fixing duplicate data
2. **API design consistency** - Establishing REST conventions
3. **Error handling patterns** - Consistent try/catch usage
4. **Code organization** - Choosing and sticking to patterns
5. **Security best practices** - Validation, sanitization, secrets
6. **Performance optimization** - Caching, pagination, query optimization
7. **Testing** - Writing tests that catch these bugs
8. **Documentation** - Making the codebase self-explanatory

---

## 🔍 Detection Tips for Workshop Participants

**To find these bugs:**
1. Run the application and test each feature
2. Use linters and static analysis tools
3. Search for TODO/FIXME/BUG comments
4. Review database seed data carefully
5. Test edge cases (missing data, invalid inputs)
6. Check network tab for inconsistent API responses
7. Review error handling in each route
8. Compare patterns across similar files

**AI assistance can help:**
- "Scan for inconsistent patterns in route files"
- "Find missing error handling"
- "Identify security vulnerabilities"
- "Suggest API design improvements"
- "Find duplicate code patterns"

---

**Last Updated**: 2026-02-03  
**For**: FanHub Workshop v0.1.0
