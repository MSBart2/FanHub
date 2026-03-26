# FanHub - GitHub Copilot Workshop Starter

> **⚠️ Intentionally Imperfect Code Ahead** — This repository contains deliberately flawed, incomplete code designed for workshop training. It is NOT production-ready and contains bugs by design.

## 🎯 Purpose

FanHub is a **workshop starter project** used to teach AI-assisted development with GitHub Copilot. This codebase is intentionally:

- 📝 **Poorly documented** — Minimal or missing documentation
- 🐛 **Buggy** — Contains deliberate bugs and edge cases
- 🔀 **Inconsistent** — Mixed patterns and incomplete implementations
- 🚧 **Incomplete** — Half-finished features requiring completion
- 🎨 **Generic** — Requires theming and customization

**The Challenge**: Transform this messy codebase into a production-ready fan site using GitHub Copilot's customization features.

## 📚 Related Resources

This is a fork/variant of the [CopilotWorkshop](https://github.com/MSBart2/CopilotWorkshop) training repository, which provides:

- **Complete workshop modules** (11+ hours of training)
- **Story-driven learning** with developer personas
- **Progressive skill building** from basics to advanced techniques
- **Comprehensive guides** on Copilot customization

For the full training experience, visit: **https://github.com/MSBart2/CopilotWorkshop**

## 🏗️ What Is FanHub?

A generic fan site application for TV shows featuring:

### 🌐 Multi-Language Support

FanHub is available in **four language implementations** to accommodate different developer preferences:

| Language | Path | Stack | Status |
|----------|------|-------|--------|
| **Node.js** | `node/` | Express + React + PostgreSQL | ✅ Original version |
| **.NET** | `dotnet/` | ASP.NET Core + Blazor + PostgreSQL | ✅ C# version |
| **Java** | `java/` | Spring Boot + React + PostgreSQL | ✅ Java version |
| **Go** | `go/` | Gin + React + PostgreSQL | ✅ Go version |

All implementations contain **intentionally similar bugs** for consistent workshop learning, but use **language-appropriate patterns** and anti-patterns specific to each ecosystem.

**Filtering GitHub Issues by Language:**
- Node.js issues: [`is:issue label:lang:node`](../../issues?q=is%3Aissue+label%3Alang%3Anode)
- .NET issues: [`is:issue label:lang:dotnet`](../../issues?q=is%3Aissue+label%3Alang%3Adotnet)
- Java issues: [`is:issue label:lang:java`](../../issues?q=is%3Aissue+label%3Alang%3Ajava)
- Go issues: [`is:issue label:lang:go`](../../issues?q=is%3Aissue+label%3Alang%3Ago)
- By severity: Add `label:severity:critical`, `label:severity:high`, etc.

### Current (Incomplete) Features
- Basic character and episode listing
- Simple API with inconsistent patterns
- Minimal frontend with generic styling
- Partial authentication scaffolding
- Database with intentional data issues

### What Participants Will Build
Through the workshop, participants transform FanHub by:

- ✅ Adding search functionality
- ✅ Implementing admin dashboard features
- ✅ Creating show-specific theming
- ✅ Building new API endpoints
- ✅ Writing comprehensive tests
- ✅ Adding proper documentation
- ✅ Establishing coding standards

## 🚀 Getting Started

Choose your language/framework and follow the setup guide:

### Node.js / React Version
📖 **[Complete Node.js Setup Guide →](node/SETUP.md)**

Quick start for Codespaces:
```bash
cd node
npm run install:all
npm start
```
Visit http://localhost:3000

### .NET / C# Version
📖 **[Complete .NET Setup Guide →](dotnet/SETUP.md)**

Quick start for Codespaces:
```bash
cd dotnet
docker-compose up -d db
cd Backend && dotnet ef database update && dotnet run
```
Visit http://localhost:5000

### Java / Spring Boot Version
📖 **[Complete Java Setup Guide →](java/SETUP.md)**

Quick start for Codespaces:
```bash
cd java
npm start
```
Visit http://localhost:3000 (frontend) and http://localhost:5265 (backend API)

### Go / Gin Version
📖 **[Complete Go Setup Guide →](go/SETUP.md)**

Quick start for Codespaces:
```bash
cd go
docker-compose up --build
```
Visit http://localhost:3000 (frontend) and http://localhost:5265 (backend API)

### Setup Options Available:
- ✨ **GitHub Codespaces** (Recommended) - Zero setup required
- 🐳 **Local Dev Container** - Consistent environment with Docker
- ⚙️ **Manual Installation** - Full control for advanced users

See the language-specific setup guides above for detailed instructions.

---

## 🎯 Next Steps

After getting the app running with any of the options above:

1. **Explore the broken app** - Visit http://localhost:3000 and notice:
   - Two Jesse Pinkman characters (duplicate bug!)
   - Season filter doesn't work properly
   - Inconsistent styling across pages
   
2. **Review the issues** - Check out the [46+ documented bugs](BUGS.md)

3. **Start the workshop** - Head to the [CopilotWorkshop](https://github.com/MSBart2/CopilotWorkshop) repository for the full training modules

4. **Try Copilot without config** - Ask Copilot to help fix something and see how it struggles without context

5. **Begin Module 1** - Add repository instructions and watch Copilot transform!

## 📂 Project Structure

```
node/
├── backend/           # Node.js/Express API (inconsistent patterns)
│   ├── src/
│   │   ├── routes/    # API endpoints (some incomplete)
│   │   ├── models/    # Database models (partial)
│   │   └── utils/     # Helper functions (minimal)
│   └── package.json
├── frontend/          # React application (generic styling)
│   ├── src/
│   │   ├── components/ # UI components (needs theming)
│   │   ├── pages/      # Page components
│   │   └── api/        # API client (incomplete)
│   └── package.json
├── docker-compose.yml # Container orchestration
└── package.json       # Root scripts
```

## 🐛 Known Issues (By Design)

These issues are **intentional** for workshop learning purposes:

### Documentation Issues
- ❌ No architecture documentation
- ❌ Missing API documentation
- ❌ No coding standards defined
- ❌ Incomplete setup instructions

### Code Quality Issues
- ❌ Inconsistent API patterns
- ❌ Mixed error handling approaches
- ❌ Incomplete input validation
- ❌ Missing edge case handling

### Feature Gaps
- ❌ No authentication implemented
- ❌ No search functionality
- ❌ No admin capabilities
- ❌ No test coverage
- ❌ Generic, unthemed UI

### Development Workflow Issues
- ❌ No CI/CD pipeline
- ❌ No linting configured
- ❌ No pre-commit hooks
- ❌ No automated testing

**Do NOT fix these yet!** The workshop teaches how to systematically address these using AI assistance.

## 🎓 Using This for Workshops

### For Participants

1. **Fork this repository** to your own GitHub account
2. **Clone your fork** locally
3. **Get the app running** using the Quick Start above
4. **Experience the struggle** — Try using basic Copilot without configuration
5. **Follow the workshop modules** to transform the codebase

### For Instructors

This starter project is designed to demonstrate:

1. **The "Before" State** — Copilot struggles with unconfigured, undocumented code
2. **Progressive Improvement** — Each configuration technique improves suggestions
3. **Compounding Value** — Later exercises benefit from earlier customizations
4. **Real-World Messiness** — Realistic scenarios, not perfect toy examples

### Workshop Learning Path

The typical workshop progression:

1. **Module 0-1**: Document architecture → Repository instructions → Immediate improvement
2. **Module 2**: Agent plan mode → Structured thinking and AI collaboration
3. **Module 3**: Custom prompts → Reusable test/spec templates
4. **Module 4**: Custom instructions → File-scoped context with applyTo patterns
5. **Module 5**: Agent Skills → Domain expertise encoding
6. **Module 6**: MCP Servers → External system connectivity
7. **Module 7**: Custom agents → Autonomous development (the payoff!)
8. **Module 8**: GitHub.com integration → Product management workflows
9. **Module 9**: Copilot CLI → Terminal automation
10. **Module 10**: Orchestration → Ship the complete app

## 📖 API Documentation (Incomplete)

### Available Endpoints

```
GET  /api/characters     # List characters (pagination incomplete)
GET  /api/characters/:id # Get character details (error handling incomplete)
GET  /api/episodes       # List episodes (filtering incomplete)
POST /api/auth/login     # Authentication (not implemented)
```

**Note**: API documentation is intentionally sparse. Workshop participants will improve this.

## 🧪 Testing (Not Configured)

Currently, running `npm test` returns:

```
No tests configured yet
```

Workshop participants will:
- Set up testing frameworks
- Write unit and integration tests
- Configure test automation
- Establish coverage requirements

## 🎨 Theming (Generic)

The current UI is deliberately generic. Workshop participants customize it for their chosen TV show:

- The Office
- Stranger Things
- Breaking Bad
- Their own choice!

## 🤝 Contributing

This repository is primarily for workshop use. However:

- **Bug reports** for actual (non-intentional) issues are welcome
- **Suggestions** for better workshop scenarios appreciated
- **Translations** or adaptations for other languages/frameworks encouraged

Please note that many "bugs" are intentional for training purposes.

## 📜 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🆘 Support

### For Workshop Participants
- Check the main [CopilotWorkshop](https://github.com/MSBart2/CopilotWorkshop) repository for detailed modules
- Review the troubleshooting guide in the workshop materials
- Ask your instructor or workshop facilitator

### For General Questions
- Open an issue in this repository
- Reference the [CopilotWorkshop](https://github.com/MSBart2/CopilotWorkshop) materials

## 🎯 Success Criteria

By the end of the workshop, participants should have:

- ✅ **Working application** with show-specific theming
- ✅ **Comprehensive documentation** and coding standards
- ✅ **Test coverage** for critical functionality
- ✅ **Copilot configuration** that produces context-aware suggestions
- ✅ **CI/CD pipeline** (basic)
- ✅ **Confidence** in AI-assisted development workflows

---

**Remember**: The messiness is the point! This starter project teaches you to transform chaos into quality using AI assistance. Embrace the challenge! 🚀
