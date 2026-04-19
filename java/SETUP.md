# FanHub Java/Spring Boot - Setup Guide

Complete setup instructions for the Java/Spring Boot version of FanHub.

> ⚠️ **Workshop Material**: This is an intentionally flawed codebase designed for GitHub Copilot training workshops. Contains 36+ bugs by design.

---

## ⚡ One-Command Start

**Requires:** [Java 17+ JDK](https://adoptium.net/) · [Node.js 18+](https://nodejs.org/)

From the repo root:

```powershell
# Windows (PowerShell)
.\java\start.ps1
```

```bash
# Linux / macOS
chmod +x java/start.sh && ./java/start.sh
```

The script starts the backend (via Maven wrapper) in a separate window (Windows) or background process (Linux/macOS), waits for it to be ready, then launches the frontend. First run may take a minute while Maven downloads dependencies.

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
cd java/backend
./mvnw spring-boot:run
```

The API starts on **http://localhost:5265** — check the **Ports** tab for the forwarded URL.

In a second terminal, start the frontend:

```bash
cd java/frontend
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

**Requires:** [Java 17+ JDK](https://adoptium.net/) · [Node.js 18+](https://nodejs.org/)

No database server needed — SQLite creates a `fanhub.db` file automatically.

**1. Start the backend:**

```bash
cd java/backend
./mvnw spring-boot:run
```

API runs on: **http://localhost:5265**

**2. In a second terminal, start the frontend:**

```bash
cd java/frontend
npm install
npm start
```

Frontend runs on: **http://localhost:3000**

---

## 💻 Development Commands

```bash
# Backend (java/backend/)
./mvnw spring-boot:run                    # Run the application
./mvnw spring-boot:run \
  -Dspring-boot.run.jvmArguments="-Dagent" # Hot reload (devtools)
./mvnw clean install                      # Build and run tests
./mvnw clean package                      # Build JAR
java -jar target/fanhub-backend-*.jar     # Run built JAR
./mvnw clean                              # Clean build artifacts

# Frontend (java/frontend/)
npm install             # Install dependencies
npm start               # Start dev server (port 3000)
npm run build           # Production build
```

---

## 🔧 Configuration

The backend uses SQLite by default — no configuration needed. The database file is created at `java/backend/fanhub.db`.

Settings live in `backend/src/main/resources/application.properties`:

```properties
server.port=5265
spring.datasource.url=${DATABASE_URL:jdbc:sqlite:./fanhub.db}
spring.datasource.driver-class-name=org.sqlite.JDBC
```

> These values are intentionally insecure for workshop purposes!

### Reset the Database

```bash
cd java/backend
rm fanhub.db      # Mac/Linux
del fanhub.db     # Windows
./mvnw spring-boot:run   # Recreates automatically on next start
```

---

## 🔍 Available API Endpoints

### Characters

- `GET /api/characters` — List all characters (includes duplicate Jesse Pinkman!)
- `GET /api/characters/{id}` — Get character by ID
- `POST /api/characters` — Create a character

### Episodes

- `GET /api/episodes` — List all episodes
- `GET /api/episodes?seasonId=1` — Filter by season (has cache bug!)
- `GET /api/episodes/{id}` — Get episode by ID

### Shows

- `GET /api/shows` — List all shows
- `GET /api/shows/{id}` — Get show by ID

### Quotes

- `GET /api/quotes` — List all quotes
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

**Inconsistent API paths:**

```bash
curl http://localhost:5265/api/characters   # ✅ works
curl http://localhost:5265/auth/login       # ✅ works (no /api prefix)
curl http://localhost:5265/api/auth/login   # ❌ 404
```

---

## 🆘 Troubleshooting

### Backend Won't Start

**"Could not open JPA EntityManagerFactory"**

This usually means a schema or dependency issue. Try:

```bash
./mvnw clean install
./mvnw spring-boot:run
```

**Port 5265 already in use:**

```bash
netstat -ano | findstr :5265  # Windows
lsof -i :5265                  # Mac/Linux
```

Change port in `application.properties`: `server.port=5266`

### Frontend Won't Start

**"Module not found":**

```bash
rm -rf node_modules package-lock.json
npm install
```

**"Proxy error: Could not proxy request":**
Ensure the backend is actually running on port 5265:

```bash
curl http://localhost:5265/api/characters
```

Check `java/frontend/package.json` has:

```json
{ "proxy": "http://localhost:5265" }
```

### Maven Issues

```bash
./mvnw clean              # Clear build output
./mvnw clean install -U   # Force-update all dependencies
```

---

## 🎓 Workshop Learning Path

This implementation contains **36+ intentional bugs** for learning purposes!

### Recommended Bug Hunting Order

1. **Critical Security**
   - Hardcoded JWT secret
   - CORS wide open
   - Weak password validation (any length accepted)
   - Missing authorization on write endpoints

2. **Spring Boot Mistakes**
   - Missing `@Transactional` on write operations
   - `@Autowired` on fields instead of constructor injection
   - N+1 query problems (no `@EntityGraph`)
   - Missing `@Valid` on request bodies

3. **Data Issues**
   - Duplicate seed data (Jesse Pinkman ×2)
   - Missing foreign key constraints
   - No pagination on list endpoints

4. **Code Quality**
   - Inconsistent API path prefixes (`/api/` vs `/`)
   - Exception stack traces exposed in responses
   - No logging
   - No tests

### Using GitHub Copilot

- Find bugs: _"Find security vulnerabilities in this Spring Boot controller"_
- Get fixes: _"How should I add proper validation here?"_
- Refactor: _"Convert this to use constructor injection"_
- Write tests: _"Generate unit tests for this service class"_

### VS Code Setup for Java

Install these extensions:

- **Extension Pack for Java** (`vscjava.vscode-java-pack`)
- **Spring Boot Extension Pack** (`vmware.vscode-boot-dev-pack`)

---

## 📚 Additional Resources

- [Main README](../README.md) — Workshop overview
- [java/BUGS.md](./BUGS.md) — Java-specific bugs catalog
- [java/README.md](./README.md) — Detailed Java workshop guide
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Spring Data JPA Docs](https://spring.io/projects/spring-data-jpa)
