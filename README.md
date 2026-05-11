# FanHub - GitHub Copilot Workshop Starter

> **⚠️ Intentionally Imperfect Code Ahead** — This repository contains deliberately flawed, incomplete code designed for workshop training. It is NOT production-ready and contains bugs by design.

## 🎯 Purpose

FanHub is a **workshop starter project** used to teach AI-assisted development with GitHub Copilot. This codebase is intentionally messy to reflect real-world legacy codebases. Participants learn to systematically improve it using Copilot's configuration features.

The project ships **pre-loaded with _Breaking Bad_ content** as the default fan domain across all language implementations, providing a rich dataset for participants to work with.

---

## 📋 Prerequisites

Choose your language track and install the required runtime:

| Track | Language | Minimum Version | Installation |
|-------|----------|-----------------|--------------|
| **Node.js** | Node.js | 18+ | https://nodejs.org/ |
| **.NET** | .NET SDK | 10.0 | https://dotnet.microsoft.com/download/dotnet/10.0 |
| **Java** | JDK | 17+ | https://adoptium.net/ |
| **Go** | Go | 1.21+ | https://go.dev/dl/ |

**For all tracks**, one of:
- **GitHub Codespaces** (recommended - no local setup required)
- **Docker Desktop** + VS Code Dev Containers extension
- **Native runtime** (platform-specific tools above)

---

## 🚀 Getting Started

### Quick Start (Choose Your Path)

#### Option 1: GitHub Codespaces (Zero Setup) ☁️

1. Click **Code** → **Codespaces** → **New codespace**
2. Select dev container config:
   - `FanHub – Node.js` (Express + React)
   - `FanHub – .NET` (ASP.NET Core + Blazor)
   - `FanHub – Java` (Spring Boot + React)
   - `FanHub – Go` (Gin + React)
3. Wait ~2 minutes for container to build
4. Follow language-specific commands below

#### Option 2: Docker + Dev Container 🐳

```bash
# Clone and open in VS Code
git clone https://github.com/MSBart2/FanHub.git
cd FanHub
code .

# Click "Reopen in Container" when prompted
# Choose your language track from the picker
```

#### Option 3: Native Runtime 💻

Install only the language runtime you need from Prerequisites section, then:

```bash
# Navigate to your language track
cd node        # or: dotnet, java, go
```

And follow language-specific commands:

### Node.js Track

```bash
cd node
npm run install:all      # Install all dependencies
npm start                # Start with Docker Compose

# OR locally (no Docker):
cd backend && npm run dev        # Terminal 1: Backend (auto-reload)
cd frontend && npm start         # Terminal 2: Frontend
```

**Services**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5265

### .NET Track

```bash
cd dotnet
./start.ps1              # Windows: One-command start
chmod +x start.sh && ./start.sh  # Linux/macOS

# OR locally:
cd Backend
dotnet ef database update
dotnet run               # Starts on http://localhost:5265

cd ../Frontend           # Terminal 2
dotnet run               # Starts on http://localhost:3000
```

**Services**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5265

### Java Track

```bash
cd java
./start.ps1              # Windows: One-command start
chmod +x start.sh && ./start.sh  # Linux/macOS

# OR locally:
cd backend
./mvnw spring-boot:run   # Starts on http://localhost:5265

cd ../frontend           # Terminal 2
npm install && npm start # Starts on http://localhost:3000
```

**Services**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5265

### Go Track

```bash
cd go
./start.ps1              # Windows: One-command start
chmod +x start.sh && ./start.sh  # Linux/macOS

# OR locally:
cd backend
go mod download
go run main.go           # Starts on http://localhost:5265

cd ../frontend           # Terminal 2
npm install && npm start # Starts on http://localhost:3000
```

**Services**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5265

### First Run Checklist

After starting the app (any track):

1. ✅ Visit http://localhost:3000 - should see Breaking Bad characters
2. ✅ Look for intentional bugs:
   - Two "Jesse Pinkman" entries (duplicate bug!)
   - Season filter doesn't work correctly
   - Generic, unthemed UI styling
3. ✅ Check API: `curl http://localhost:5265/api/characters`

### Environment Configuration

Each track uses `.env.example` as a template. Create `.env` in your language's backend directory:

```bash
# Database (SQLite - file-backed, no server required)
DATABASE_URL=sqlite:./fanhub.db

# Backend
PORT=5265
JWT_SECRET=dev_secret_change_in_production
NODE_ENV=development

# Frontend
REACT_APP_API_URL=http://localhost:5265
```

### Detailed Setup & Reference Guides

For comprehensive setup instructions, architecture details, and workshop-specific content, see your language track's guides:

- **Node.js**: [SETUP](node/SETUP.md) | [Workshop Guide](node/README.md)
- **.NET**: [SETUP](dotnet/SETUP.md) | [Workshop Guide](dotnet/README.md)
- **Java**: [SETUP](java/SETUP.md) | [Workshop Guide](java/README.md)
- **Go**: [SETUP](go/SETUP.md) | [Workshop Guide](go/backend/README.md)

Each SETUP guide includes troubleshooting, database management, and dev environment configuration specific to your language.

---

## 🧪 Testing

### Current Status: Tests Not Configured (Intentional)

All tracks have placeholder test scripts:

```bash
# Node.js (root)
npm test                 # Returns: "No tests configured yet"

# Node.js backend
cd node/backend && npm test

# Node.js frontend
cd node/frontend && npm test

# .NET
dotnet test

# Java
./mvnw test

# Go
go test ./...
```

### Workshop Exercise

Part of the workshop is configuring testing frameworks and writing tests. This is intentional - you'll add:
- Unit test frameworks (Jest, xUnit, JUnit, Go testing)
- Integration test suites
- GitHub Actions CI/CD for automated test runs
- Code coverage reporting

---

## 🏗️ Architecture

### Multi-Language Implementation

FanHub is implemented in 4 languages with equivalent bugs and features to demonstrate Copilot's language-agnostic utility:

| Component | Node.js | .NET | Java | Go |
|-----------|---------|------|------|-----|
| Backend | Express 4.18 | ASP.NET Core 10 | Spring Boot 3.2 | Gin |
| Frontend | React 18.2 | Blazor Server | React 18.2 | React 18.2 |
| Database | SQLite | SQLite | SQLite | SQLite |
| Auth | JWT (incomplete) | JWT (incomplete) | JWT (incomplete) | JWT (incomplete) |
| ORM | Raw SQL / better-sqlite3 | Entity Framework Core | Spring Data JPA | Native SQL |

### Database Schema

```
shows
  ├── seasons
  │   ├── episodes
  │   └── character_episodes (join)
  ├── characters
  │   └── quotes
  └── users
      └── user_favorites (join)
```

### API Endpoints (All Tracks)

```
GET    /api/shows              - List all shows
GET    /api/shows/:id          - Get show details
GET    /api/characters         - List characters (includes duplicate!)
GET    /api/characters/:id     - Get character details
POST   /api/characters         - Create character
GET    /api/episodes           - List episodes
GET    /api/episodes?seasonId=1 - Filter by season (has cache bug!)
GET    /api/episodes/:id       - Get episode details
GET    /api/quotes             - List quotes
GET    /api/quotes/random      - Random quote

POST   /auth/register          - Register user (weak validation)
POST   /auth/login             - Login (incomplete)
```

### Known Intentional Issues

**Critical** (3):
- Duplicate Jesse Pinkman in seed data
- Episode cache ignores season filter
- Inconsistent API paths (/api/* vs /auth inconsistency)

**High Priority** (15):
- Missing error handling on routes
- Weak password requirements
- CORS wide open (AllowAnyOrigin)
- No input validation
- SQL injection vulnerability in Go search

**Code Quality** (19):
- 4 different component styling approaches
- Mixed class/functional components
- Inconsistent async patterns
- Missing tests entirely
- Generic UI with no theming

See [BUGS.md](BUGS.md) for the complete 46+ bug catalog with examples.

### Project Structure

```
fanhub/
├── node/                  # Node.js/Express + React track
│   ├── backend/
│   ├── frontend/
│   ├── SETUP.md          # Detailed Node.js setup guide
│   └── README.md         # Node.js workshop guide
├── dotnet/                # ASP.NET Core + Blazor track
│   ├── Backend/
│   ├── Frontend/
│   ├── SETUP.md
│   └── README.md
├── java/                  # Spring Boot + React track
│   ├── backend/
│   ├── frontend/
│   ├── SETUP.md
│   └── README.md
├── go/                    # Gin + React track
│   ├── backend/
│   ├── frontend/
│   ├── SETUP.md
│   └── backend/README.md
├── docs/
│   └── breaking-bad-universe.md  # Domain reference for Copilot
├── mcp-servers/           # MCP server implementations
├── BUGS.md                # Complete bug catalog
├── CONTRIBUTING.md
└── README.md              # This file
```

---

## 🤝 Contributing

### For Workshop Participants

1. **Fork** this repository
2. **Create a branch** for your exercise (e.g., `module-1-instructions`)
3. **Make your changes** using Copilot
4. **Test locally** before pushing
5. **Open a PR** and reference the workshop module

### For Maintainers

- **Bug reports** for actual (non-intentional) issues: welcome
- **Suggestions** for workshop improvements: welcome
- **Translations** for other frameworks: encouraged
- **Note**: Many "bugs" are intentional for training - check [BUGS.md](BUGS.md) before reporting

### Documentation Contributions

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:
- Language-specific bug documentation
- Workshop module suggestions
- Dev container improvements
- API endpoint documentation

---

## 🎓 Workshop Learning Path

The typical progression is:

1. **Module 0-1** (1.5-2 hrs): Add repository instructions, see Copilot's suggestions improve
2. **Module 2** (1.5 hrs): Use Agent plan mode for structured development
3. **Module 3** (1.5 hrs): Create custom prompt templates for tests, components, endpoints
4. **Module 4** (1.5 hrs): Add custom instructions with file-scoped context
5. **Module 5** (1.5 hrs): Build Agent Skills encoding domain expertise
6. **Module 6** (1.5 hrs): Configure MCP servers for database/GitHub access
7. **Module 7** (1.5 hrs): Build custom agents - the payoff moment!
8. **Modules 8-10** (4 hrs): Deploy using Copilot CLI and GitHub integration

For full workshop materials, see [CopilotWorkshop](https://github.com/MSBart2/CopilotWorkshop).

---

## 📖 Additional Resources

- **[BUGS.md](BUGS.md)** - Complete catalog of 46+ intentional bugs with examples
- **[GOOD-IDEAS.md](GOOD-IDEAS.md)** - Feature ideas for participants
- **[Breaking Bad Lore](docs/breaking-bad-universe.md)** - Reference for Copilot domain knowledge
- **[CopilotWorkshop](https://github.com/MSBart2/CopilotWorkshop)** - Full training curriculum (11+ hours)

---

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.

---

**Remember**: The messiness is intentional! This teaches you to transform real-world code using AI assistance. Embrace the challenge! 🚀
