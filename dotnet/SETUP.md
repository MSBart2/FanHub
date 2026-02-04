# FanHub .NET Setup Guide

Complete setup instructions for the .NET/C# version of FanHub.

---

## 🚀 Quick Start Options

### Option 1: GitHub Codespaces (✨ Recommended)

**Zero setup required!** Click the **"Code"** button → **"Create codespace on main"**.

Your cloud-based environment includes:
- ✅ .NET 10 SDK pre-installed
- ✅ VS Code with C# extensions
- ✅ GitHub Copilot & Copilot Chat activated
- ✅ Docker for PostgreSQL
- ✅ All dependencies configured

**Build time:** 2-3 minutes first launch

Once your Codespace is ready:
```bash
cd dotnet
docker-compose up -d db
cd Backend
dotnet restore
dotnet ef database update
dotnet run
```

**Access the app**: Use the forwarded ports (5000 for API)

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
3. Click **"Reopen in Container"** when prompted
4. Wait for container to build (2-3 minutes first time)
5. Follow the manual setup steps below

---

### Option 3: Manual Installation (⚙️ Advanced)

#### Prerequisites

| Requirement | Details |
|-------------|---------|
| **VS Code 1.107+** | [Download](https://code.visualstudio.com/download) |
| **GitHub Copilot** | Install both [Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) + [Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extensions |
| **.NET 10 SDK** | [Download](https://dotnet.microsoft.com/download/dotnet/10.0) · Verify: `dotnet --version` |
| **Docker Desktop** | [Download](https://www.docker.com/products/docker-desktop/) (for PostgreSQL) |
| **GitHub Account** | With [Copilot access](https://github.com/features/copilot) |

#### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/MSBart2/FanHub.git
cd FanHub/dotnet

# 2. Start PostgreSQL with Docker
docker-compose up -d db

# 3. Run migrations and start backend
cd Backend
dotnet restore
dotnet ef database update
dotnet run

# 4. In another terminal, start frontend (when available)
cd ../Frontend
dotnet restore
dotnet run

# Application URLs:
# Frontend: http://localhost:5001 (when implemented)
# Backend API: http://localhost:5000
# PostgreSQL: localhost:5432
```

#### Stop Services

```bash
# Stop .NET applications
# Press Ctrl+C in each terminal

# Stop database
docker-compose down
```

---

## 💻 Development

### Available Commands

```bash
# Backend (dotnet/Backend/)
dotnet restore             # Restore NuGet packages
dotnet build               # Build the project
dotnet run                 # Run the application
dotnet watch run           # Run with hot reload
dotnet test                # Run tests (when implemented)
dotnet ef database update  # Apply migrations
dotnet ef migrations add   # Create new migration

# Frontend (dotnet/Frontend/) - Coming soon
dotnet restore
dotnet run
```

---

## 🔧 Configuration

### appsettings.json

The connection string and other settings are in `Backend/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=fanhub;Username=fanhub;Password=fanhub_dev_password"
  },
  "Jwt": {
    "SecretKey": "change_this_in_production_use_a_long_random_string",
    "Issuer": "FanHub",
    "Audience": "FanHub"
  }
}
```

**Note:** These values are intentionally insecure for workshop purposes!

---

## 🗄️ Database Management

### Access Database Shell

```bash
docker exec -it fanhub-dotnet-db-1 psql -U fanhub -d fanhub
```

### Useful Queries

```sql
-- View characters
SELECT * FROM "Characters";

-- View episodes
SELECT * FROM "Episodes";

-- View shows
SELECT * FROM "Shows";
```

### Reset Database

```bash
# Drop database and recreate
docker-compose down -v
docker-compose up -d db

# Wait for database to be ready, then:
cd Backend
dotnet ef database update
```

---

## 🐛 Debugging

### Check Docker Containers

```bash
docker ps
```

### View Database Logs

```bash
docker logs fanhub-dotnet-db-1 -f
```

### Check Database Connection

```bash
docker exec fanhub-dotnet-db-1 pg_isready -U fanhub
```

### Enable Detailed Logging

In `appsettings.Development.json`:

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

## 🆘 Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                  # Mac/Linux

# Kill the process if needed
```

### Database Connection Errors

```bash
# Restart database
docker-compose restart db

# Check database is running
docker ps | grep postgres
```

### Migration Errors

```bash
# Remove all migrations and start fresh
rm -rf Migrations/
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### NuGet Package Issues

```bash
# Clear NuGet cache
dotnet nuget locals all --clear

# Restore packages
dotnet restore --force
```

---

## 📚 Additional Resources

- [Main README](../README.md) - Workshop overview
- [dotnet/BUGS.md](./BUGS.md) - .NET-specific bugs catalog
- [dotnet/README.md](./README.md) - Detailed .NET workshop guide
- [Microsoft .NET Docs](https://docs.microsoft.com/dotnet/)
- [Entity Framework Core Docs](https://docs.microsoft.com/ef/core/)

---

**Need help?** Check the [CopilotWorkshop](https://github.com/MSBart2/CopilotWorkshop) repository for detailed modules and troubleshooting guides.
