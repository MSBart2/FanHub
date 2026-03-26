# FanHub Node.js Setup Guide

Complete setup instructions for the Node.js/Express + React version of FanHub.

> ⚠️ **Workshop Material**: This is an intentionally flawed codebase designed for GitHub Copilot training workshops.

---

## 🚀 Quick Start

### Option 1: GitHub Codespaces ☁️ (Recommended — zero setup)

1. Click **Code → Open with Codespaces** on the repository page.
2. Wait for the container to build (the devcontainer handles all prerequisites).
3. In the terminal, start the backend:

```bash
cd node/backend
npm install
npm start
```

The API starts on **http://localhost:5265** — check the **Ports** tab for the forwarded URL.

In a second terminal, start the frontend:

```bash
cd node/frontend
npm install
npm start
```

The frontend starts on **http://localhost:3000**.

---

### Option 2: Local Dev Container 🐳 (Consistent local environment)

**Requires:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) + [VS Code Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

1. Open the repository in VS Code.
2. Click **"Reopen in Container"** when prompted.
3. Follow Option 1's terminal steps above — all tools are pre-installed.

---

### Option 3: Local Runtime 💻 (No Docker required)

**Requires:** [Node.js 18+](https://nodejs.org/)

No database server needed — SQLite creates a `fanhub.db` file automatically.

**1. Start the backend:**

```bash
cd node/backend
npm install
npm start
```

API runs on: **http://localhost:5265**

**2. In a second terminal, start the frontend:**

```bash
cd node/frontend
npm install
npm start
```

Frontend runs on: **http://localhost:3000**

---

## 💻 Development Commands

```bash
# Backend (node/backend/)
npm install         # Install dependencies
npm start           # Start the server
npm run dev         # Start with nodemon (auto-reload on file changes)

# Frontend (node/frontend/)
npm install         # Install dependencies
npm start           # Start dev server (port 3000)
npm run build       # Production build
npm test            # Run tests
```

---

## 🔧 Configuration

The backend uses SQLite by default — no configuration needed. The database file is created at `node/backend/data/fanhub.db`.

To customize, create a `.env` file in `node/backend/`:

```env
PORT=5265
JWT_SECRET=change_this_in_production
NODE_ENV=development
```

The frontend auto-connects to the backend via the proxy in `node/frontend/package.json`. No frontend `.env` needed for local development.

### Reset the Database

```bash
# Delete the database file — it will be recreated with seed data on next start
cd node/backend
rm data/fanhub.db     # Mac/Linux
del data\fanhub.db    # Windows
npm start
```

---

## 🔍 Available API Endpoints

### Characters
- `GET /api/characters` — List all characters (includes duplicate Jesse Pinkman!)
- `GET /api/characters/:id` — Get character by ID
- `POST /api/characters` — Create a character

### Episodes
- `GET /api/episodes` — List all episodes
- `GET /api/episodes?seasonId=1` — Filter by season (has cache bug!)
- `GET /api/episodes/:id` — Get episode by ID

### Shows
- `GET /api/shows` — List all shows
- `GET /api/shows/:id` — Get show by ID

### Quotes
- `GET /api/quotes` — List all quotes
- `GET /api/quotes/random` — Get a random quote

### Authentication (Incomplete)
- `POST /auth/register` — Register (no password strength validation!)
- `POST /auth/login` — Login (incomplete JWT implementation)

---

## 🧪 Testing the App

### Verify Bugs Are Present

**Duplicate Jesse Pinkman:**
```bash
curl http://localhost:5265/api/characters
```
Expected: Two Jesse Pinkman entries.

**Inconsistent API paths:**
```bash
curl http://localhost:5265/api/characters   # ✅ works
curl http://localhost:5265/auth/login       # ✅ works (no /api prefix)
curl http://localhost:5265/api/auth/login   # ❌ 404
```

---

## 🆘 Troubleshooting

### Port Already in Use

```bash
# Find process using the port (Windows)
netstat -ano | findstr :5265

# Mac/Linux
lsof -i :5265
```

### Node Module Issues

```bash
# Clean reinstall
rm -rf node_modules package-lock.json
npm install
```

### Frontend Can't Reach Backend

Ensure the backend is running on port 5265:
```bash
curl http://localhost:5265/api/characters
```

Check `node/frontend/package.json` has:
```json
{ "proxy": "http://localhost:5265" }
```

---

## 🎓 Workshop Learning Path

This implementation contains **intentional bugs** for learning purposes!

### Using GitHub Copilot

- Find bugs: *"Find security vulnerabilities in this Express middleware"*
- Get fixes: *"How should I validate user input here?"*
- Refactor: *"Add proper error handling to this route"*
- Write tests: *"Generate unit tests for this controller"*

---

## 📚 Additional Resources

- [Main README](../README.md) — Workshop overview
- [node/README.md](./README.md) — Detailed Node.js workshop guide
- [Express Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
