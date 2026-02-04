# FanHub .NET - C# Workshop Proof-of-Concept

> **⚠️ Intentionally Buggy Code** — This is a C# version of the FanHub workshop with deliberate bugs, misconfigurations, and code quality issues designed for learning GitHub Copilot.

## 🎯 Purpose

This is a proof-of-concept implementation of FanHub in C# (.NET 10) with Blazor Server frontend. It demonstrates that the multi-language workshop approach is feasible while teaching .NET-specific Copilot patterns.

## 🏗️ Technology Stack

- **Backend**: ASP.NET Core Web API (.NET 10)
- **Frontend**: Blazor Server
- **Database**: PostgreSQL 15
- **ORM**: Entity Framework Core 10
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
dotnet/
├── Backend/              # ASP.NET Core Web API
│   ├── Controllers/      # API endpoints (with bugs!)
│   ├── Models/           # Entity models (missing validation)
│   ├── Data/             # DbContext (incomplete configuration)
│   ├── Program.cs        # App configuration (hardcoded secrets!)
│   └── Backend.csproj    # Project file
├── Frontend/             # Blazor Server (coming soon)
├── docker-compose.yml    # Container orchestration
├── BUGS.md               # C#-specific bug catalog
└── README.md             # This file
```

## 🐛 Intentional Bugs (So Far)

### Backend API Bugs
1. **Null Reference Exceptions** - No null checks in controllers
2. **Missing Async/Await** - SaveChangesAsync not awaited in UpdateCharacter
3. **No Error Handling** - Controllers missing try/catch blocks
4. **Missing Validation** - No [Required] attributes on models
5. **Hardcoded Connection String** - In Program.cs
6. **CORS Wide Open** - AllowAnyOrigin security issue
7. **Wrong HTTP Status Codes** - POST returns 200 instead of 201
8. **Missing Navigation Properties** - Incomplete EF Core relationships
9. **No OnModelCreating** - DbContext missing configuration
10. **UseHttpsRedirection** - But created with --no-https

## 🚀 Getting Started

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [VS Code](https://code.visualstudio.com/) with C# Dev Kit

### Quick Start

**Option 1: With Docker** (Recommended)
```bash
cd dotnet
docker-compose up -d postgres
cd Backend
dotnet ef database update
dotnet run
```

**Option 2: Local PostgreSQL**
```bash
cd dotnet/Backend
dotnet restore
dotnet ef database update
dotnet run
```

Backend API will run on: `http://localhost:5000`

### Database Setup

1. **Create migration:**
```bash
cd Backend
dotnet ef migrations add InitialCreate
```

2. **Apply migration:**
```bash
dotnet ef database update
```

3. **Seed data** (coming soon - will include duplicate Jesse Pinkman bug!)

## 📝 Current Status

✅ **Completed:**
- ASP.NET Core Web API project setup
- Entity models with intentional bugs
- DbContext (incomplete)
- Characters controller with multiple bugs
- Docker Compose configuration (in progress)

🚧 **In Progress:**
- Database migrations
- Seed data with bugs
- Additional controllers (Shows, Episodes, Quotes)
- Blazor Server frontend

⏳ **Todo:**
- Auth controller (weak password requirements)
- Frontend components with Blazor bugs
- Complete BUGS.md documentation
- Devcontainer configuration

## 🎓 Learning Objectives

This C# version teaches:

### Backend (.NET/EF Core)
- Null reference exception handling
- Async/await patterns and antipatterns
- EF Core navigation properties
- Model validation with Data Annotations
- Dependency injection scopes
- Configuration management
- HTTP status code conventions

### Frontend (Blazor - Coming Soon)
- Component lifecycle bugs
- StateHasChanged misuse
- Event handler memory leaks
- Parameter binding issues
- CSS isolation

## 🔧 Workshop Exercises

Participants will use GitHub Copilot to:

1. **Find and fix null reference bugs** - Add proper null checks
2. **Add model validation** - Use [Required], [EmailAddress], etc.
3. **Fix async/await antipatterns** - Properly await async methods
4. **Configure EF Core relationships** - Add OnModelCreating
5. **Implement error handling** - Add try/catch with proper responses
6. **Secure the API** - Fix CORS, move secrets to config
7. **Write tests** - Add xUnit tests for controllers

## 📚 Comparison with Node.js Version

| Feature | Node.js Version | C# Version |
|---------|----------------|------------|
| Backend Framework | Express | ASP.NET Core |
| ORM | Raw SQL | Entity Framework Core |
| Frontend | React | Blazor Server |
| Language Paradigm | Dynamic | Static, Strongly-typed |
| Typical Bugs | Missing error handling | Null references, async issues |
| Learning Focus | API patterns | Type safety, LINQ, EF Core |

## 🆘 Troubleshooting

**"Connection string is invalid"**
- Update the connection string in `Program.cs` (line 11)
- Or set environment variable: `POSTGRES_CONNECTION_STRING`

**"Database does not exist"**
- Run: `docker-compose up -d postgres`
- Run: `dotnet ef database update`

**"Port 5000 already in use"**
- Change port in `Properties/launchSettings.json`

## 📄 License

MIT License - Same as parent FanHub project

---

**Next Steps**: Complete Docker setup, create migrations, implement Blazor frontend
