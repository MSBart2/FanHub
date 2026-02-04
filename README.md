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

### Current (Incomplete) Features
- Basic character and episode listing
- Simple API with inconsistent patterns
- Minimal frontend with generic styling
- Partial authentication scaffolding
- SQLite database (no migrations yet)

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

Choose your preferred development environment:

### Option 1: GitHub Codespaces (✨ Recommended)

**Zero setup required!** Click the **"Code"** button above → **"Create codespace on main"**.

Your cloud-based environment includes:
- ✅ VS Code in the browser (or connect from desktop VS Code)
- ✅ GitHub Copilot & Copilot Chat pre-installed and activated
- ✅ Mermaid diagram rendering for architecture visuals
- ✅ All FanHub development tools (Node.js, Docker, PostgreSQL)
- ✅ Ports automatically forwarded for the app (3000, 3001, 5432)
- ✅ Docker-in-Docker for running containers
- ✅ Works from any device—even tablets!

**Build time:** 2-3 minutes first launch, instant thereafter

Once your Codespace is ready:
```bash
cd src
npm run install:all
npm start
```

**Access the app**: Click the "Ports" tab and open port 3000 in your browser.

📖 [Learn more about the dev container setup](.devcontainer/README.md)

---

### Option 2: Local Dev Container (🐳 Preferred for Local Development)

**Near-zero setup** using VS Code with Docker Desktop:

**Requirements:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [VS Code](https://code.visualstudio.com/download)
- [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

**Steps:**
1. Clone this repository: `git clone https://github.com/MSBart2/FanHub.git`
2. Open the folder in VS Code
3. Click **"Reopen in Container"** when prompted (or use Command Palette → "Dev Containers: Reopen in Container")
4. Wait for container to build (2-3 minutes first time)
5. Once ready:
   ```bash
   cd src
   npm run install:all
   npm start
   ```

Same consistent environment as Codespaces, but running locally on your machine.

📖 [Troubleshooting dev containers](.devcontainer/README.md)

---

### Option 3: Manual Installation (⚙️ Advanced)

If you prefer to set up everything yourself without containers:

| Requirement | Details |
|-------------|---------|
| **VS Code 1.107+** | [Download](https://code.visualstudio.com/download) · Check version: Help → About |
| **GitHub Copilot** | Install both [Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) + [Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extensions |
| **Docker Desktop** | [Download](https://www.docker.com/products/docker-desktop/) (for PostgreSQL database) |
| **Node.js 18+** | [Download](https://nodejs.org/) · Verify: `node --version` |
| **GitHub Account** | With [Copilot access](https://github.com/features/copilot) (Individual, Business, or Enterprise) |

**Installation steps:**
```bash
# 1. Clone repository
git clone https://github.com/MSBart2/FanHub.git
cd FanHub/src

# 2. Install dependencies
npm run install:all

# 3. Start services with Docker
npm start

# Application URLs:
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# PostgreSQL: localhost:5432
```

**Stop services:**
```bash
npm stop
```

**Note**: Manual setup requires configuring your own environment, installing tools, and troubleshooting dependencies. We recommend Codespaces or Dev Containers for a smoother experience.

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
src/
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
