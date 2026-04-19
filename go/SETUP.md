# FanHub Go Setup Guide

Complete setup instructions for the Go/Gin version of FanHub.

> ⚠️ **Workshop Material**: This is an intentionally flawed codebase designed for GitHub Copilot training workshops. Contains ~42 bugs by design.

---

## ⚡ One-Command Start

**Requires:** [Go 1.21+](https://go.dev/dl/) · [Node.js 18+](https://nodejs.org/)

From the repo root:

```powershell
# Windows (PowerShell)
.\go\start.ps1
```

```bash
# Linux / macOS
chmod +x go/start.sh && ./go/start.sh
```

The script downloads Go modules, starts the backend in a separate window (Windows) or background process (Linux/macOS), waits for it to be ready, then launches the frontend.

| Service     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:3000 |
| Backend API | http://localhost:5265 |

Press **Ctrl+C** in the frontend terminal to stop both processes.

---

## 🚀 Quick Start

### Option 1: GitHub Codespaces ☁️ (Recommended — zero setup)

1. Click **Code → Open with Codespaces** on the repository page.
2. Wait for the container to build (the devcontainer handles all prerequisites).
3. In the terminal, start the backend:

```bash
cd go/backend
go mod download
go run main.go
```

The API starts on **http://localhost:5265** — check the **Ports** tab for the forwarded URL.

In a second terminal, start the frontend:

```bash
cd go/frontend
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

**Requires:** [Go 1.21+](https://go.dev/dl/) · [Node.js 18+](https://nodejs.org/)

No database server needed — SQLite creates a `fanhub.db` file automatically.

**1. Start the backend:**

```bash
cd go/backend
go mod download
go run main.go
```

API runs on: **http://localhost:5265**

**2. In a second terminal, start the frontend:**

```bash
cd go/frontend
npm install
npm start
```

Frontend runs on: **http://localhost:3000**

---

## 💻 Development Commands

```bash
# Backend (go/backend/)
go mod download         # Download dependencies
go run main.go          # Run the application
go build -o fanhub .    # Build binary
go run -race main.go    # Run with race detector (finds concurrency bugs!)
go mod tidy             # Clean up dependencies

# Optional: hot reload with Air
go install github.com/air-verse/air@latest
air

# Frontend (go/frontend/)
npm install             # Install dependencies
npm start               # Start dev server (port 3000)
npm run build           # Production build
```

---

## 🔧 Configuration

The backend is configured via environment variables. Create a `.env` file in `go/backend/`:

```env
PORT=5265
DB_PATH=./fanhub.db
GIN_MODE=debug
JWT_SECRET=your-secret-key-change-in-production
```

The database file is created automatically at startup — no migration step required.

### Reset the Database

```bash
cd go/backend
rm fanhub.db     # Mac/Linux
del fanhub.db    # Windows
go run main.go   # Recreates and seeds automatically
```

---

## 🔍 Available API Endpoints

### Characters

- `GET /api/characters` — List all characters (includes duplicate Jesse Pinkman!)
- `GET /api/characters/:id` — Get character by ID
- `GET /api/characters/search?name=Walter` — Search (has SQL injection bug!)
- `POST /api/characters` — Create a character

### Episodes

- `GET /api/episodes` — List all episodes
- `GET /api/episodes?seasonId=1` — Filter by season (has cache bug!)
- `GET /api/episodes/:id` — Get episode by ID
- `POST /api/episodes` — Create an episode

### Shows

- `GET /api/shows` — List all shows
- `GET /api/shows/:id` — Get show by ID
- `POST /api/shows` — Create a show

### Quotes

- `GET /api/quotes` — List all quotes
- `GET /api/quotes/random` — Get a random quote
- `POST /api/quotes` — Create a quote

### Authentication (Incomplete)

- `POST /auth/register` — Register (weak password validation!)
- `POST /auth/login` — Login (incomplete JWT implementation)

---

## 🧪 Testing the App

### Verify Bugs Are Present

**Duplicate Jesse Pinkman:**

```bash
curl http://localhost:5265/api/characters
```

Expected: Two Jesse Pinkman entries.

**Cache bug:**

```bash
curl http://localhost:5265/api/episodes?seasonId=1
curl http://localhost:5265/api/episodes?seasonId=2
```

Expected: Both return Season 1 episodes.

**SQL injection:**

```bash
curl "http://localhost:5265/api/characters/search?name='; DROP TABLE characters; --"
```

Expected: SQL error visible in response.

### Race Detector

Go has built-in race detection:

```bash
go run -race main.go
```

Expected: Detects race condition in episode cache.

---

## 🆘 Troubleshooting

### Port Already in Use

```bash
# Find process using the port (Windows)
netstat -ano | findstr :5265

# Mac/Linux
lsof -i :5265
```

### Go Module Issues

```bash
go clean -modcache
go mod download
go mod tidy
```

### Frontend Proxy Not Working

Ensure `go/frontend/package.json` has:

```json
{
  "proxy": "http://localhost:5265"
}
```

### Enable Debug Logging

Set `GIN_MODE=debug` (it is by default in local dev).

---

## 🎓 Workshop Learning Path

This implementation contains **~42 intentional bugs** for learning purposes!

### Recommended Bug Hunting Order

1. **Critical Security**
   - SQL injection in character search
   - Hardcoded JWT secret fallback
   - CORS wide open (`AllowAllOrigins`)
   - Auth middleware not applied to routes

2. **Classic Go Mistakes**
   - Missing `if err != nil` checks
   - Race condition in episode cache (run with `-race`)
   - Goroutine leak in episode service
   - No `context.Context` propagation

3. **Design Issues**
   - Global database variable (no DI)
   - Mixed pointer/value receivers
   - Inconsistent JSON tags
   - No input validation

4. **Performance**
   - Cache key ignores `seasonId`
   - Missing pagination
   - N+1 query problems

5. **Code Quality**
   - Exposed error messages in responses
   - Inconsistent naming conventions
   - Missing documentation
   - No tests

### Using GitHub Copilot

- Find bugs: _"Find security vulnerabilities in this file"_
- Get fixes: _"How should I handle this error in Go?"_
- Refactor: _"Refactor this to use context.Context"_
- Write tests: _"Generate unit tests for this handler"_

---

## 📚 Additional Resources

- [Main README](../README.md) — Workshop overview
- [go/BUGS.md](./backend/BUGS.md) — Go-specific bugs catalog
- [go/WORKSHOP.md](./backend/WORKSHOP.md) — Workshop challenges
- [Go Documentation](https://go.dev/doc/)
- [Gin Framework Docs](https://gin-gonic.com/docs/)
