# FanHub Dev Container

This directory contains the configuration for the **development container** used in GitHub Codespaces and VS Code Dev Containers.

The dev container is language-agnostic — it supports all four FanHub workshop implementations out of the box: **Node.js**, **Go**, **Java**, and **.NET**.

## What's Included

### Pre-installed Tools

- ✅ **Node.js** - For all React frontends and the Node.js backend
- ✅ **Go** - For the Go/Gin backend
- ✅ **Java + Maven** - For the Spring Boot backend
- ✅ **.NET SDK** - For the ASP.NET Core + Blazor implementation
- ✅ **Docker-in-Docker** - Run containers inside the dev container
- ✅ **Git** - Version control
- ✅ **SQLite** - Lightweight file-based database (no server required)

### VS Code Extensions

- ✅ **GitHub Copilot** - AI pair programming
- ✅ **GitHub Copilot Chat** - AI chat assistant
- ✅ **ESLint** - JavaScript/TypeScript linting
- ✅ **Prettier** - Code formatting
- ✅ **Go** - Go language support
- ✅ **Java Pack** - Java language support
- ✅ **C# Dev Kit** - .NET / C# language support
- ✅ **SQLite Viewer** - Browse SQLite database files
- ✅ **Docker** - Container management
- ✅ **Markdown Mermaid** - Diagram rendering
- ✅ **Markdown All in One** - Enhanced markdown editing

### Ports Forwarded

| Port | Language | Service     |
| ---- | -------- | ----------- |
| 3000 | All      | Frontend    |
| 5265 | All      | Backend API |

## Using with GitHub Codespaces

1. Click **"Code"** → **"Create codespace on main"** in the GitHub repository
2. Wait 2-3 minutes for the environment to build
3. Once ready, navigate to your chosen language folder and follow its `SETUP.md`:
   ```bash
   cd node    # Node.js/Express
   cd go      # Go/Gin
   cd java    # Java/Spring Boot
   cd dotnet  # .NET/Blazor
   ```
4. Click the **"Ports"** tab and open the appropriate frontend port

## Using with VS Code Dev Containers

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [VS Code](https://code.visualstudio.com/) installed
- [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) installed

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/MSBart2/FanHub.git
   cd FanHub
   ```

2. Open in VS Code:

   ```bash
   code .
   ```

3. When prompted, click **"Reopen in Container"**

   Or manually: Press `F1` → **"Dev Containers: Reopen in Container"**

4. Wait for the container to build (2-3 minutes first time)

5. Once the container is ready, navigate to your language folder and follow its `SETUP.md`

## Rebuilding the Container

If you make changes to `.devcontainer/devcontainer.json`:

1. Press `F1`
2. Select **"Dev Containers: Rebuild Container"**
3. Wait for rebuild to complete

## Troubleshooting

### Container won't build

- Ensure Docker Desktop is running
- Check Docker has enough resources (4GB+ RAM recommended)
- Try: `F1` → **"Dev Containers: Rebuild Container Without Cache"**

### Port already in use

- Stop any local instances of the app running outside the container
- Or update port configuration in the relevant language's `docker-compose.yml`

### Extensions not loading

- Reload window: `F1` → **"Developer: Reload Window"**
- Check VS Code is up to date (1.107+)

### Copilot not working

- Check you're signed into GitHub in VS Code
- Verify Copilot subscription is active
- Reload window: `F1` → **"Developer: Reload Window"**

## Why Use a Dev Container?

### Benefits

✅ **Consistent environment** - Everyone uses the same setup
✅ **Zero config** - No manual installation of tools
✅ **Isolated** - Doesn't affect your local machine
✅ **Reproducible** - Works the same everywhere
✅ **Fast onboarding** - New team members productive in minutes

### Perfect for Workshops

- Eliminates "works on my machine" problems
- Ensures all participants have Copilot installed
- Pre-configures recommended VS Code settings
- Provides consistent baseline for learning regardless of language track

## Configuration Details

### Base Image

Uses `mcr.microsoft.com/devcontainers/universal:2` — Microsoft's universal dev container image that includes Node.js, Go, Java, .NET, and more pre-installed. Docker-in-Docker support is added as a feature so you can run `docker compose` commands inside the container.

### Database

All implementations use **SQLite** (file-based). No database server is needed — the database file lives alongside the application code.

### Workspace Mount

The repository is mounted at `/workspaces/<repo-name>` inside the container with full read/write access.

### User

Runs as the `codespace` user (non-root) for security.

### Post-Create Command

After the container is created, a welcome message is displayed pointing to the language-specific setup guides.

## Advanced: Customizing the Dev Container

Edit `.devcontainer/devcontainer.json` to:

- Add more VS Code extensions
- Change VS Code settings
- Add additional tools via `features`
- Modify port forwarding
- Add environment variables

Example - Add a new extension:

```json
"extensions": [
  "github.copilot",
  "your.extension.id"
]
```

After editing, rebuild the container for changes to take effect.

## Learn More

- [Dev Containers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [GitHub Codespaces Documentation](https://docs.github.com/codespaces)
- [Dev Container Features](https://containers.dev/features)
