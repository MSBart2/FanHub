# FanHub .NET - C# Workshop Proof-of-Concept

> **⚠️ Intentionally Buggy Code** — This is a C# version of the FanHub workshop with deliberate bugs, misconfigurations, and code quality issues designed for learning GitHub Copilot.

## 🎯 Purpose

This is a proof-of-concept implementation of FanHub in C# (.NET 10) with Blazor Server frontend. It demonstrates that the multi-language workshop approach is feasible while teaching .NET-specific Copilot patterns.

## 🏗️ Technology Stack

- **Backend**: ASP.NET Core Web API (.NET 10)
- **Frontend**: Blazor Server
- **Database**: SQLite (file-based, no server required)
- **ORM**: Entity Framework Core 10
- **Containerization**: Docker & Docker Compose (optional)

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

Choose the environment that works best for you:

---

### Option 1: GitHub Codespaces ☁️ (Recommended — zero setup)

1. Click **Code → Open with Codespaces** on the repository page.
2. Wait for the container to build (the devcontainer handles all prerequisites).
3. In the terminal:

```bash
cd dotnet/Backend
dotnet ef database update
dotnet run
```

The API will be forwarded automatically — check the **Ports** tab for the URL.

---

### Option 2: Local with Docker 🐳

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

This option runs the full app in containers.

```bash
cd dotnet
docker compose up -d
```

Backend API will run on: `http://localhost:5000`

To apply migrations into the running container:

```bash
cd dotnet/Backend
dotnet ef database update
```

To stop:

```bash
cd dotnet
docker compose down
```

---

### Option 3: Local Runtime 💻 (No Docker required)

**Prerequisites:** [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)

No database server needed — SQLite creates a local `fanhub.db` file automatically.

1. **Install EF tools** (first time only):

```bash
dotnet tool install --global dotnet-ef
```

2. **Run the backend:**

```bash
cd dotnet/Backend
dotnet restore
dotnet ef database update
dotnet run
```

Backend API will run on: `http://localhost:5000`

---

### Seed Data

Seed data is coming soon — will include the duplicate Jesse Pinkman bug!

---

## 🧪 Testing the Backend

First, start the backend (see Getting Started above). It runs on `http://localhost:5265`.

### Option A: VS Code `.http` file

Open [Backend/Backend.http](Backend/Backend.http) in VS Code. With the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension installed, you'll see **Send Request** links above each request. Available endpoints:

| Method | URL                    | Notes                                 |
| ------ | ---------------------- | ------------------------------------- |
| `GET`  | `/api/shows`           | List all shows                        |
| `GET`  | `/api/characters`      | List all characters                   |
| `GET`  | `/api/characters/{id}` | Get one — **BUG: 500 if not found**   |
| `POST` | `/api/characters`      | Create — **BUG: returns 200 not 201** |
| `GET`  | `/api/episodes`        | List all episodes                     |
| `GET`  | `/api/quotes`          | List all quotes                       |

### Option B: OpenAPI / Swagger UI

With the backend running, the raw OpenAPI spec is at:

```
http://localhost:5265/openapi/v1.json
```

You can paste this URL into [editor.swagger.io](https://editor.swagger.io) or use the [Swagger Viewer](https://marketplace.visualstudio.com/items?itemName=Arjun.swagger-viewer) VS Code extension for an interactive UI.

### Option C: curl

```bash
# List characters
curl http://localhost:5265/api/characters

# Get a show
curl http://localhost:5265/api/shows/1

# Create a character
curl -X POST http://localhost:5265/api/characters \
  -H "Content-Type: application/json" \
  -d '{"name":"Walter White","actorName":"Bryan Cranston","bio":"Chemistry teacher.","isMainCharacter":true,"status":"Deceased","showId":1}'
```

---

## 🖥️ Running the Frontend

The Blazor Server frontend runs separately from the backend.

**1. Start the backend first** (it must be running on port 5265):

```bash
cd dotnet/Backend
dotnet run
```

**2. In a second terminal, start the frontend:**

```bash
cd dotnet/Frontend
dotnet run
```

Frontend will open at: `http://localhost:5171`

Pages available:

- `/` — Home
- `/characters` — Characters list (fetches from backend API)
- `/episodes` — Episodes list

> **Note:** There is an intentional bug in `Frontend/Program.cs` — the `HttpClient` is not configured with the backend base address, so API calls from the frontend will fail. This is one of the workshop exercises to fix!

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

| Feature           | Node.js Version        | C# Version                    |
| ----------------- | ---------------------- | ----------------------------- |
| Backend Framework | Express                | ASP.NET Core                  |
| ORM               | Raw SQL                | Entity Framework Core         |
| Frontend          | React                  | Blazor Server                 |
| Language Paradigm | Dynamic                | Static, Strongly-typed        |
| Typical Bugs      | Missing error handling | Null references, async issues |
| Learning Focus    | API patterns           | Type safety, LINQ, EF Core    |

## 🆘 Troubleshooting

**`dotnet ef` command not found**

Install the EF global tool: `dotnet tool install --global dotnet-ef`

**Port already in use**

Change the port in `dotnet/Backend/Properties/launchSettings.json` or set `ASPNETCORE_URLS=http://localhost:5001` before running.

**Database errors after model changes**

Delete `fanhub.db` and re-run `dotnet ef database update` to start fresh.

**"Database does not exist"**

- Run: `docker-compose up -d postgres`
- Run: `dotnet ef database update`

**"Port 5000 already in use"**

- Change port in `Properties/launchSettings.json`

## 📄 License

MIT License - Same as parent FanHub project

---

**Next Steps**: Complete Docker setup, create migrations, implement Blazor frontend
