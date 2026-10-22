# FanHub - Workshop Starter Application

> ⚠️ **Workshop Material**: This is an intentionally flawed codebase designed for GitHub Copilot training workshops. Contains 46+ bugs by design.

A generic fan site application for TV shows featuring characters, episodes, quotes, and user authentication. Built with React, Node.js, Express, and SQLite.

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [What's Missing: The Copilot Configurations](#-whats-missing-the-copilot-configurations)
- [Architecture Overview](#-architecture-overview)
- [Known Issues](#-known-issues)
- [Workshop Learning Path](#-workshop-learning-path)
- [Project Structure](#-project-structure)
- [Development](#-development)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **Docker Desktop**
- **Git**

### Installation

```bash
# Install all dependencies (root, backend, and frontend)
npm run install:all

# Start all services with Docker
npm start

# Application URLs:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5265
# Database: SQLite file at backend/data/fanhub.db
```

### First Time Setup

```bash
# Copy environment variables
cp .env.example .env

# Start services
npm start

# In another terminal, verify the database
docker exec -it fanhub-backend-1 sqlite3 /app/data/fanhub.db "SELECT COUNT(*) FROM characters;"
```

### Stop Services

```bash
npm stop
```

---

## ❌ What's Missing: The Copilot Configurations

This codebase is **intentionally unconfigured** for GitHub Copilot. The workshop teaches you to add these configurations and see Copilot's suggestions improve dramatically.

### Missing Configuration Files

#### 1. ❌ Repository Instructions (Module 1)
**File**: `.github/copilot-instructions.md`

**Purpose**: Project-wide context that Copilot reads automatically
- Architecture patterns and conventions
- Tech stack details
- Coding standards
- Database schema information
- API design patterns

**Impact Without It**: 
- Copilot gives generic, confused suggestions
- Doesn't understand your show theme
- Suggests incorrect patterns
- No awareness of Breaking Bad context

**Example of what's missing**:
```markdown
# FanHub - Breaking Bad Fan Site

This is a React + Node.js application for Breaking Bad fans.
Main characters: Walter White, Jesse Pinkman, Skyler White, Hank Schrader...
Tech stack: React 18, Express, SQLite, styled-components...
```

---

#### 2. ❌ Custom Prompts Library (Module 3)
**Directory**: `.github/prompts/`

**Purpose**: Reusable prompt templates for common tasks
- `test-generator.prompt` - Generate comprehensive tests
- `api-endpoint.prompt` - Create REST endpoints
- `react-component.prompt` - Build React components
- `spec-to-code.prompt` - Convert requirements to code

**Impact Without It**:
- Must retype instructions for repetitive tasks
- Inconsistent code generation
- No standardized workflows

**Example of what's missing**:
```
# File: .github/prompts/test-generator.prompt
Generate comprehensive tests for the selected code including:
- Unit tests for all functions
- Integration tests for API endpoints
- Edge cases and error scenarios
- Mock external dependencies
Use Jest and follow existing test patterns in __tests__/
```

---

#### 3. ❌ Custom Instructions (Module 4)
**Directory**: `.github/instructions/`

**Purpose**: File-scoped context using `applyTo` patterns
- API route conventions (applies to `**/routes/*.js`)
- React component patterns (applies to `**/*.jsx`)
- Test file standards (applies to `**/*.test.js`)
- Database query guidelines (applies to `**/database/*.js`)

**Impact Without It**:
- No context-specific guidance
- Copilot doesn't know file-specific patterns
- Generic suggestions instead of domain-specific

**Example of what's missing**:
```markdown
# File: .github/instructions/api-routes.md
applyTo: **/routes/*.js

All API routes must:
- Use async/await (not .then())
- Wrap in try/catch blocks
- Return consistent response format: { success, data, error }
- Use 201 for POST, 200 for GET/PUT/DELETE
- Validate input parameters
```

---

#### 4. ❌ Agent Skills (Module 5)
**Directory**: `.github/skills/`

**Purpose**: Domain expertise that Copilot loads automatically
- FanHub domain knowledge
- Breaking Bad character information
- Bug reproduction patterns
- Feature requirement templates

**Impact Without It**:
- Copilot lacks domain expertise
- Doesn't know character names, relationships
- Can't help with show-specific features

**Example of what's missing**:
```markdown
# File: .github/skills/fanhub-domain.md
---
skill-type: domain-knowledge
domain: fanhub-breaking-bad
---

# Breaking Bad Domain Knowledge

## Main Characters
- Walter White (Heisenberg) - Chemistry teacher turned meth manufacturer
- Jesse Pinkman - Walt's partner, small-time dealer
- Skyler White - Walt's wife, becomes complicit
...

## Common Quotes
- "I am the one who knocks" - Walter White
- "Yeah, science!" - Jesse Pinkman
...
```

---

#### 5. ❌ MCP Server Configuration (Module 6)
**File**: `.vscode/mcp.json`

**Purpose**: Connect Copilot to external systems
- Database queries (SQLite)
- GitHub API integration
- Deployment awareness
- Log analysis

**Impact Without It**:
- Copilot can't query actual data
- No awareness of deployment state
- Can't validate against real database

**Example of what's missing**:
```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", 
               "./backend/data/fanhub.db"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}
```

---

#### 6. ❌ Custom Agents (Module 7)
**File**: `.github/copilot/agents/fanhub-builder.yml`

**Purpose**: Autonomous agents for complex tasks
- Background agents for feature development
- Specialized agents for testing, documentation
- Agents that leverage ALL prior configurations

**Impact Without It**:
- Can't create autonomous development workflows
- Must manually orchestrate all tasks
- Can't leverage compound context

**Example of what's missing**:
```yaml
name: FanHub Builder
description: Autonomous agent for building FanHub features
instructions: |
  Use repository instructions, custom prompts, and skills
  to build production-ready features with tests and docs.
tools:
  - file_operations
  - code_generation
  - testing
  - documentation
```

---

### Configuration Impact Comparison

| Configuration | Without It | With It |
|--------------|------------|---------|
| **Repository Instructions** | "Create a character component" → Generic React component | "Create a character component" → Breaking Bad themed with Heisenberg colors |
| **Custom Prompts** | Manually describe test requirements each time | One-click comprehensive test generation |
| **Custom Instructions** | Route uses .then() and returns 200 | Route uses async/await, returns 201, proper error handling |
| **Agent Skills** | "Add Walter White quote" → Makes up quote | "Add Walter White quote" → Uses actual "I am the danger" quote |
| **MCP Servers** | Can't check if Jesse Pinkman duplicate exists | Queries database, finds duplicate, suggests fix |
| **Custom Agents** | Build feature step-by-step manually | Agent builds feature with tests and docs autonomously |

---

## 🏗️ Architecture Overview

### Tech Stack

**Frontend**:
- React 18.2 with React Router 6
- Styled-components (inconsistently applied)
- Axios for API calls
- No state management library

**Backend**:
- Node.js with Express 4.18
- SQLite via better-sqlite3
- JWT authentication (incomplete)
- bcrypt for password hashing

**Infrastructure**:
- Docker Compose for local development
- SQLite (file-backed, no separate database service)
- No CI/CD configured

### Database Schema

```
shows → seasons → episodes
  ↓                  ↓
characters ← character_episodes
  ↓
quotes

users → user_favorites → characters
```

### API Structure

```
/api/shows           - Show management
/api/characters      - Character CRUD
/api/episodes        - Episode listing
/api/episodes/:id    - Episode detail with related characters and quotes
/api/quotes          - Quote management
/auth               - Authentication (⚠️ inconsistent path!)
```

### Character Detail (#4 — complete)

The `/characters/:id` route requests `GET /api/characters/:id` through
`charactersApi.getById`. Unlike the episode endpoint, the character API returns
the character object directly (Axios: `response.data`), including its `episodes`
array, without a `{ success, data }` envelope.

- Character cards are keyed by ID and use React Router links to `/characters/:id`, replacing the placeholder alerts.
- The profile shows the name, actor, biography, image, status, and main/supporting role from numeric `is_main_character` values (`1`/`0`). Missing or broken images fall back to initials.
- Recorded episode appearances show the title, episode number, and featured status, with an empty-record message when none are recorded. There are no season labels or episode links; the episode-detail route is available separately.
- Loading, HTTP 404, and other request failures have distinct messages. A **Back to Characters** link is always available.

### Episode Detail (#5 — complete)

Click an episode on `/episodes` to open `/episodes/:id`. The detail route also
loads directly by requesting `GET /api/episodes/:id` through `episodesApi.getById`;
the API success body is `{ success: true, data: episode }` (Axios:
`response.data.data`). Every detail state includes a **Back to episodes** link
to `/episodes`, independent of browser history. The shared Header/Footer and
other routes are unchanged.

The page is read-only: it shows episode/show/season information and available
metadata, related character names/actors/images/featured indicators, and quote
text/speakers/context. Numeric zero values are retained; date-only air dates
are displayed without timezone conversion. Missing or broken images use text
fallbacks. Missing descriptions, characters, and quotes have explanatory empty
states; unknown quote speakers are labeled. Empty association arrays are valid
(the seed data has no episode-character associations); cast is never inferred
from quotes. Characters do not link to the separate character-detail feature
(#4), and quotes have no mutation controls.

Loading, HTTP 404 (not found), and other request failures have distinct states.
Changing the route clears previous content and image failures; stale requests
and requests settling after unmount cannot replace the current episode. Invalid
success response envelopes are shown as request errors rather than empty details.

For direct URL entry or refresh in production, configure the SPA host to serve
`index.html` for frontend routes such as `/characters/:id` and `/episodes/:id`,
without intercepting API requests. Both detail routes retain the shared
Header/Footer and the original list, home, and about routes.

---

## 🐛 Known Issues

This codebase has **46+ intentional bugs** documented in `/BUGS.md`:

### Critical (3)
- ❌ Duplicate Jesse Pinkman in seed data
- ❌ Episode cache ignores season filter
- ❌ Inconsistent API paths (/api/* vs /auth)

### High Priority (15)
- Missing error handling
- Weak password requirements
- Security vulnerabilities (CORS, exposed errors)
- No input validation
- Invalid bcrypt hash

### Code Quality (19)
- 4 different styling approaches
- Mixed class/functional components
- Inconsistent file extensions (.js vs .jsx)
- Mixed async patterns (.then vs async/await)
- Inconsistent naming conventions

See **[BUGS.md](../BUGS.md)** for complete list with examples.

---

## 🎓 Workshop Learning Path

This application is designed for a progressive workshop teaching AI-assisted development:

### Module 0: The Struggle (30 min)
**Current State**: Try using Copilot now - watch it give confused, generic suggestions

**Experience**:
- Ask "Add a character" → Gets generic suggestions
- No awareness of Breaking Bad
- Suggests wrong patterns
- Doesn't follow conventions (because there aren't any!)

### Module 1: Repository Instructions (90 min)
**Add**: `.github/copilot-instructions.md`

**Transformation**: Ask the same question - now gets Breaking Bad context!

### Module 2: Agent Plan Mode (90 min)
**Learn**: Structured thinking and systematic AI collaboration

**Transformation**: Plan before implementing, configure AI with AI

### Module 3: Custom Prompts (90 min)
**Add**: `.github/prompts/*.prompt` files

**Transformation**: One-click test generation, API endpoints, components

### Module 4: Custom Instructions (90 min)
**Add**: `.github/instructions/*.md` with `applyTo` patterns

**Transformation**: File-specific context automatically applied

### Module 5: Agent Skills (90 min)
**Add**: `.github/skills/*.md` domain knowledge

**Transformation**: Copilot knows Breaking Bad characters, quotes, relationships

### Module 6: MCP Servers (75 min)
**Add**: `.vscode/mcp.json`

**Transformation**: Copilot can query database, check for duplicates

### Module 7: Custom Agents - THE PAYOFF (90 min)
**Add**: `.github/copilot/agents/*.yml`

**Transformation**: Autonomous feature development leveraging ALL prior config

### Modules 8-10: Web, CLI, Orchestration (240 min)
**Learn**: Use Copilot across all interfaces, ship the app

---

## 📁 Project Structure

```
node/
├── .github/                    # ❌ MISSING COPILOT CONFIG
│   ├── copilot-instructions.md # ❌ Add in Module 1
│   ├── prompts/                # ❌ Add in Module 3
│   ├── instructions/           # ❌ Add in Module 4
│   ├── skills/                 # ❌ Add in Module 5
│   └── copilot/agents/         # ❌ Add in Module 7
├── .vscode/                    # ❌ MISSING
│   └── mcp.json                # ❌ Add in Module 6
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   ├── connection.js   # ⚠️ Inconsistent error handling
│   │   │   ├── schema.sql
│   │   │   └── seed.sql        # 🐛 Has duplicate Jesse Pinkman!
│   │   ├── routes/
│   │   │   ├── auth.js         # ⚠️ Incomplete implementation
│   │   │   ├── characters.js   # ⚠️ Mixed patterns
│   │   │   ├── episodes.js     # ⚠️ Uses .then() instead of async
│   │   │   ├── quotes.js
│   │   │   └── shows.js
│   │   └── index.js            # 🐛 CORS wide open, inconsistent paths
│   ├── __tests__/              # ❌ No tests yet
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CharacterCard.jsx    # Styled-components
│   │   │   ├── EpisodeList.js       # Inline styles
│   │   │   ├── Footer.js            # Class component (old)
│   │   │   ├── Header.jsx           # Functional with hooks
│   │   │   └── QuoteDisplay.jsx     # CSS Modules
│   │   ├── pages/
│   │   │   ├── Characters.jsx       # ⚠️ Class component
│   │   │   ├── CharacterDetail.jsx  # /characters/:id profile
│   │   │   ├── Episodes.js          # 🐛 Cache bug!
│   │   │   ├── Episodes.test.js     # 9 list/cache/navigation tests
│   │   │   ├── EpisodeDetail.js     # Read-only detail route (#5)
│   │   │   ├── EpisodeDetail.test.js # 33 detail/lifecycle/error tests
│   │   │   ├── Home.jsx
│   │   │   └── About.jsx            # ⚠️ Uses <style> tag!
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.test.js              # Router integration tests for detail pages
│   │   └── styles/
│   │       ├── global.css
│   │       └── QuoteDisplay.module.css
│   ├── __tests__/              # README points to src/**/*.test.js
│   └── package.json
├── docker-compose.yml
├── package.json
└── README.md                   # 👈 You are here
```

**Legend**:
- ❌ Missing entirely
- ⚠️ Exists but has issues
- 🐛 Contains intentional bugs

---

## 💻 Development

### Available Scripts

```bash
# Root level
npm start              # Start all services with Docker
npm stop               # Stop all services
npm run install:all    # Install all dependencies
npm run backend        # Start backend only (port 3001)
npm run frontend       # Start frontend only (port 3000)
npm test               # Placeholder: prints "No tests configured yet" and exits successfully
npm run db:reset       # Reset database with fresh seed data

# Backend (cd backend/)
npm run dev            # Start with nodemon (auto-reload)
npm start              # Start production mode

# Frontend (cd frontend/)
npm start              # Start development server
npm run build          # Build for production
npm test               # React Scripts/Jest (interactive watch mode)
```

### Frontend Validation

Frontend validation must run in `node/frontend`, not via the root placeholder
`npm test`. Run the full non-watch Jest suite and a normal production build:

```bash
# From node/frontend (bash)
CI=true npx react-scripts test --watchAll=false
# Unset CI for the normal build, without changing the parent shell's environment.
(unset CI; npm run build)
```

```powershell
# From node/frontend (PowerShell)
$previousCI = $env:CI
try {
    $env:CI = "true"
    npx react-scripts test --watchAll=false
    Remove-Item Env:CI -ErrorAction SilentlyContinue
    npm run build
} finally {
    $env:CI = $previousCI
}
```

Frontend Jest tests live beside the source under `src/**/*.test.js`:

- `src/pages/CharacterDetail.test.js`: profile data, image/field fallbacks,
  recorded and empty appearances, loading, 404/failures, and route changes.
- `src/pages/Characters.test.js`: ID-based card links, filters, search, empty
  results, and failures.
- `src/pages/Episodes.test.js`: **9 cases** from the episode-detail branch, retaining the original 8 list/cache
  regressions and adding episode-detail navigation, with router-aware rendering.
- `src/pages/EpisodeDetail.test.js`: **33 cases** from the episode-detail branch covering detail rendering,
  empty/error states, lifecycle and route changes, including reviewer-strengthened
  StrictMode request races, scoped portrait fallback, and 404/500 route resets.
- `src/App.test.js`: shared integration seam for both character and episode
  list/detail/back navigation, direct detail URLs, and shared Header/Footer.
  Its final combined inventory depends on integration of both branches' tests.

See [the test guide](frontend/__tests__/README.md) for character-side coverage
and mock usage; it does not yet list the episode-detail additions. These tests
use API mocks, not a live backend, and are not comprehensive coverage of all
frontend features. The root `npm test` placeholder is not validation.

Historical episode-branch validation: the earlier full suite passed **40/40**;
after revisions, the targeted detail suite passed **33/33**, and that branch's
final full-suite rerun passed **47/47 across 3 suites**, including its 5 App
integration cases. These are branch-specific results, not the combined #4/#5
inventory or proof that the integrated suite passes. Jest emitted React `act`
deprecation and React Router future-flag warnings, but no test failures.
Both branches reported that a normal `npm run build` with CI unset passed
with existing warnings. **`CI=true npm run build` does not pass**: React Scripts
treats existing lint warnings as errors (unused `useState`/`useEffect` imports in
`Characters.jsx` and the `latestRequest.current` effect-cleanup warning in
`Episodes.js`). Both warning sites were reported as verified in the episode
branch's HEAD; these unrelated workshop defects remain unchanged. The commands above
explicitly unset CI for the normal build rather than implying a CI build passes.

Live browser/backend scenarios were **not performed**. Issue #5's feature
implementation is checked below; a passing final full-suite rerun and reviewer
acceptance are required before any local commit, enforced by the orchestrator.
The episode branch's full-suite gate passed; neither an integrated full-suite
pass nor reviewer acceptance is claimed by those historical results.

### Environment Variables

Create `.env` file from `.env.example`:

```bash
# Database (SQLite — file-backed, no separate service required)
DATABASE_PATH=./data/fanhub.db

# Backend
PORT=5265
JWT_SECRET=change_this_in_production
NODE_ENV=development

# Frontend
REACT_APP_API_URL=http://localhost:5265
```

### Database Management

```bash
# Access database shell
docker exec -it fanhub-backend-1 sqlite3 /app/data/fanhub.db

# View characters (should see duplicate Jesse!)
SELECT id, name, actor_name FROM characters;

# Check quotes attribution
SELECT q.id, c.name, q.quote_text FROM quotes q 
LEFT JOIN characters c ON q.character_id = c.id;

# Reset database (drop all data and reseed)
npm run db:reset
```

### Debugging

```bash
# Check Docker containers
docker ps

# View backend logs
docker logs fanhub-backend-1 -f

# View frontend logs
docker logs fanhub-frontend-1 -f

# Inspect the SQLite database file
docker exec fanhub-backend-1 ls -lh /app/data/fanhub.db
```

---

## 🎯 Workshop TODO List

As you progress through the workshop, check off these items:

### Configuration Setup
- [ ] Add `.github/copilot-instructions.md` (Module 1)
- [ ] Create `.github/prompts/` directory with prompt files (Module 3)
- [ ] Add `.github/instructions/` with applyTo patterns (Module 4)
- [ ] Create `.github/skills/` with domain knowledge (Module 5)
- [ ] Configure `.vscode/mcp.json` for database access (Module 6)
- [ ] Build custom agents in `.github/copilot/agents/` (Module 7)

### Bug Fixes
- [ ] Fix duplicate Jesse Pinkman in seed data (#6)
- [ ] Fix episode cache to respect season filter (#7)
- [ ] Standardize API paths (move /auth to /api/auth) (#8)
- [ ] Add error handling to all routes (#9, #10)
- [ ] Implement proper input validation (#18)
- [ ] Fix CORS configuration (#16)
- [ ] Standardize response formats (#14)

### Code Quality
- [ ] Choose one styling approach and refactor all components (#22)
- [ ] Convert all components to functional with hooks (#21)
- [ ] Standardize file extensions (.jsx for all React) (#23)
- [ ] Refactor all routes to use async/await (#24)
- [ ] Standardize error handling patterns (#27)

### Features
- [ ] Complete authentication implementation (#44)
- [x] Add character detail page (#4)
- [x] Add episode detail page (#5) — final full-suite pass and reviewer acceptance required before local commit
- [ ] Implement search functionality
- [ ] Add admin panel
- [ ] Add dark mode support (#2)
- [ ] Make UI fully responsive (#3)

### Testing & CI/CD
- [ ] Add unit tests for backend routes (#42)
- [ ] Add React component tests (#42)
- [ ] Add integration tests (#42)
- [ ] Set up GitHub Actions CI/CD (#43)
- [ ] Add code coverage reporting

---

## 📚 Additional Resources

### Related Files
- **[/BUGS.md](../BUGS.md)** - Complete catalog of all 46+ bugs
- **[/README.md](../README.md)** - Workshop overview and purpose
- **[GitHub Issues](https://github.com/MSBart2/FanHub/issues)** - All bugs as trackable issues

### External Links
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Custom Instructions Guide](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [Custom Prompts in VS Code](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [CopilotWorkshop Repository](https://github.com/MSBart2/CopilotWorkshop)

---

## 🤔 FAQ

**Q: Why is the code so messy?**  
A: It's intentionally messy! This teaches you to improve existing codebases, not build greenfield projects.

**Q: Should I fix the bugs first or add Copilot config first?**  
A: Add Copilot config first! The workshop shows how proper configuration makes fixing bugs much easier.

**Q: Can I use a different TV show?**  
A: Absolutely! Change the seed data and update repository instructions to your favorite show.

**Q: Why Breaking Bad?**  
A: Well-known show with clear character relationships, memorable quotes, and dramatic arcs - perfect for a fan site demo.

**Q: Where are the tests?**  
A: Frontend Jest tests live beside the source under `src/**/*.test.js`, including
`src/pages/Characters.test.js`, `src/pages/CharacterDetail.test.js`,
`src/pages/Episodes.test.js`, `src/pages/EpisodeDetail.test.js`, and
`src/App.test.js`. See [Frontend Validation](#frontend-validation) for coverage
and commands, and [the test guide](frontend/__tests__/README.md) for character-side guidance.
Run React Scripts/Jest from `frontend/`: the root `npm test` is only a
success-exiting placeholder, not validation. More tests are added during the workshop.

**Q: Is this production-ready?**  
A: Absolutely not! This is a learning project with intentional security issues and bugs.

---

## 📝 Notes

### What Makes This Different

Unlike typical tutorials with perfect starter code:
- ✅ **Real-world mess**: Inconsistent patterns like actual legacy codebases
- ✅ **Multiple bugs**: 46+ issues to discover and fix
- ✅ **Incomplete features**: Authentication half-done, no tests, etc.
- ✅ **Configuration journey**: See Copilot improve as you add context
- ✅ **Progressive learning**: Each module builds on the previous

### The "Aha!" Moment

Most users experience this in **Module 1** when they:
1. Try Copilot without config → Generic, confused suggestions
2. Add repository instructions with Breaking Bad context
3. Try the same prompt again → Now gets show-specific, context-aware code!

That's when it clicks: **Context is everything.**

---

**Built with ❤️ (and intentional bugs 🐛) for GitHub Copilot workshops**

_This codebase was "started by a contractor who left mid-project." Can you and Copilot turn it into something great?_
