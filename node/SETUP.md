# FanHub Node.js Setup Guide

Complete setup instructions for the Node.js/React version of FanHub.

---

## 🚀 Quick Start Options

Choose your preferred development environment:

### Option 1: GitHub Codespaces (✨ Recommended)

**Zero setup required!** Click the **"Code"** button → **"Create codespace on main"**.

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
cd node
npm run install:all
npm start
```

**Access the app**: Click the "Ports" tab and open port 3000 in your browser.

📖 [Learn more about the dev container setup](../.devcontainer/README.md)

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
   cd node
   npm run install:all
   npm start
   ```

Same consistent environment as Codespaces, but running locally on your machine.

📖 [Troubleshooting dev containers](../.devcontainer/README.md)

---

### Option 3: Manual Installation (⚙️ Advanced)

If you prefer to set up everything yourself without containers:

#### Prerequisites

| Requirement | Details |
|-------------|---------|
| **VS Code 1.107+** | [Download](https://code.visualstudio.com/download) · Check version: Help → About |
| **GitHub Copilot** | Install both [Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) + [Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extensions |
| **Docker Desktop** | [Download](https://www.docker.com/products/docker-desktop/) (for PostgreSQL database) |
| **Node.js 18+** | [Download](https://nodejs.org/) · Verify: `node --version` |
| **GitHub Account** | With [Copilot access](https://github.com/features/copilot) (Individual, Business, or Enterprise) |

#### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/MSBart2/FanHub.git
cd FanHub/node

# 2. Install dependencies
npm run install:all

# 3. Start services with Docker
npm start

# Application URLs:
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# PostgreSQL: localhost:5432
```

#### Stop Services

```bash
npm stop
```

**Note**: Manual setup requires configuring your own environment, installing tools, and troubleshooting dependencies. We recommend Codespaces or Dev Containers for a smoother experience.

---

## 💻 Development

### Available Scripts

```bash
# Root level (node/)
npm start              # Start all services with Docker
npm stop               # Stop all services
npm run install:all    # Install all dependencies
npm run backend        # Start backend only (port 3001)
npm run frontend       # Start frontend only (port 3000)
npm test               # Run tests (not implemented yet)
npm run db:reset       # Reset database with fresh seed data

# Backend (cd backend/)
npm run dev            # Start with nodemon (auto-reload)
npm start              # Start production mode

# Frontend (cd frontend/)
npm start              # Start development server
npm run build          # Build for production
npm test               # Run tests (not implemented)
```

---

## 🔧 Environment Variables

Create `.env` file from `.env.example`:

```bash
# Database
DATABASE_URL=postgres://fanhub:fanhub_dev_password@localhost:5432/fanhub

# Backend
PORT=3001
JWT_SECRET=change_this_in_production
NODE_ENV=development

# Frontend
REACT_APP_API_URL=http://localhost:3001
```

---

## 🗄️ Database Management

### Access Database Shell

```bash
docker exec -it fanhub-db-1 psql -U fanhub -d fanhub
```

### Useful Database Queries

```sql
-- View characters (should see duplicate Jesse!)
SELECT id, name, actor_name FROM characters;

-- Check quotes attribution
SELECT q.id, c.name, q.quote_text FROM quotes q 
LEFT JOIN characters c ON q.character_id = c.id;
```

### Reset Database

```bash
# Drop all data and reseed
npm run db:reset
```

---

## 🐛 Debugging

### Check Docker Containers

```bash
docker ps
```

### View Logs

```bash
# Backend logs
docker logs fanhub-backend-1 -f

# Frontend logs
docker logs fanhub-frontend-1 -f

# Database logs
docker logs fanhub-db-1 -f
```

### Check Database Connection

```bash
docker exec fanhub-db-1 pg_isready -U fanhub
```

---

## 🆘 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
npx kill-port 3000

# Or for port 3001
npx kill-port 3001
```

### Database Connection Errors

```bash
# Restart database container
docker-compose restart db

# Check database is running
docker ps | grep postgres
```

### Docker Issues

```bash
# Clean restart
docker-compose down -v
docker-compose up --build
```

### Node Modules Issues

```bash
# Clean reinstall
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
npm run install:all
```

---

## 📚 Additional Resources

- [Main README](../README.md) - Workshop overview
- [BUGS.md](../BUGS.md) - Complete catalog of intentional bugs
- [node/README.md](./README.md) - Detailed Node.js workshop guide
- [GitHub Issues](https://github.com/MSBart2/FanHub/issues) - Tracked bugs

---

**Need help?** Check the [CopilotWorkshop](https://github.com/MSBart2/CopilotWorkshop) repository for detailed modules and troubleshooting guides.
