# FanHub .NET Setup Guide

Complete setup instructions for the .NET/C# version of FanHub.

> ⚠️ **Workshop Material**: This is an intentionally flawed codebase designed for GitHub Copilot training workshops.

---

## 🚀 Quick Start

### Option 1: GitHub Codespaces ☁️ (Recommended — zero setup)

1. Click **Code → Open with Codespaces** on the repository page.
2. Wait for the container to build (the devcontainer handles all prerequisites).
3. In the terminal:

```bash
cd dotnet/Backend
dotnet restore
dotnet ef database update
dotnet run
```

The API starts on **http://localhost:5265** — check the **Ports** tab for the forwarded URL.

In a second terminal, start the frontend:

```bash
cd dotnet/Frontend
dotnet restore
dotnet run
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

**Requires:** [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)

No database server needed — SQLite creates a `fanhub.db` file automatically.

**1. Install EF tools** (first time only):

```bash
dotnet tool install --global dotnet-ef
```

**2. Start the backend:**

```bash
cd dotnet/Backend
dotnet restore
dotnet ef database update
dotnet run
```

API runs on: **http://localhost:5265**

**3. In a second terminal, start the frontend:**

```bash
cd dotnet/Frontend
dotnet restore
dotnet run
```

Frontend runs on: **http://localhost:3000**

---

## 💻 Development Commands

```bash
# Backend (dotnet/Backend/)
dotnet restore               # Restore NuGet packages
dotnet build                 # Build the project
dotnet run                   # Run the application
dotnet watch run             # Run with hot reload
dotnet ef database update    # Apply migrations
dotnet ef migrations add     # Create a new migration

# Frontend (dotnet/Frontend/)
dotnet restore
dotnet run
dotnet watch run             # Hot reload
```

---

## 🔧 Configuration

### Connection String

The backend uses SQLite by default — no configuration needed. The database file is created at `dotnet/Backend/fanhub.db`.

Settings live in `Backend/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=fanhub.db"
  },
  "Jwt": {
    "Secret": "dev_secret_change_in_production",
    "Issuer": "FanHub",
    "Audience": "FanHub"
  }
}
```

> These values are intentionally insecure for workshop purposes!

### Reset the Database

```bash
# Delete the database file and recreate
cd dotnet/Backend
rm fanhub.db         # Mac/Linux
del fanhub.db        # Windows
dotnet ef database update
```

---

## 🔍 Available API Endpoints

- `GET /api/characters` — List all characters
- `GET /api/characters/{id}` — Get character by ID
- `POST /api/characters` — Create a character
- `GET /api/shows` — List all shows
- `GET /api/episodes` — List all episodes
- `GET /api/quotes` — List all quotes
- `POST /auth/register` — Register a user
- `POST /auth/login` — Login

OpenAPI docs: **http://localhost:5265/openapi/v1.json**

---

## 🆘 Troubleshooting

### Port Already in Use

```bash
# Find process using port 5265
netstat -ano | findstr :5265  # Windows
lsof -i :5265                  # Mac/Linux
```

Change the port in `Backend/Properties/launchSettings.json` if needed.

### Migration Errors

```bash
# Remove all migrations and start fresh
rm -rf Migrations/
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### NuGet Package Issues

```bash
dotnet nuget locals all --clear
dotnet restore --force
```

### Logging

Enable detailed EF Core logging in `appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  }
}
```

---

## 🎓 Workshop Learning Path

This implementation contains **10+ intentional bugs** for learning purposes!

### Intentional Bugs

1. **Null Reference Exceptions** — No null checks in controllers
2. **Missing Async/Await** — `SaveChangesAsync` not awaited in `UpdateCharacter`
3. **No Error Handling** — Controllers missing try/catch blocks
4. **Missing Validation** — No `[Required]` attributes on models
5. **Hardcoded Secrets** — JWT secret in `Program.cs`
6. **CORS Wide Open** — `AllowAnyOrigin` security issue
7. **Wrong HTTP Status Codes** — POST returns 200 instead of 201
8. **Missing Navigation Properties** — Incomplete EF Core relationships
9. **No OnModelCreating** — DbContext missing configuration
10. **UseHttpsRedirection** — But created with `--no-https`

### Using GitHub Copilot

- Find bugs: *"Find security vulnerabilities in this file"*
- Get fixes: *"How should I handle this error?"*
- Refactor: *"Add proper async/await to this method"*
- Write tests: *"Generate unit tests for this controller"*

---

## 📚 Additional Resources

- [Main README](../README.md) — Workshop overview
- [dotnet/BUGS.md](./BUGS.md) — .NET-specific bugs catalog
- [dotnet/README.md](./README.md) — Detailed .NET workshop guide
- [Microsoft .NET Docs](https://docs.microsoft.com/dotnet/)
- [Entity Framework Core Docs](https://docs.microsoft.com/ef/core/)
