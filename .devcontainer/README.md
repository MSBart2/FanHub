# FanHub Dev Containers

This directory contains **four language-specific dev container configurations**, one per FanHub workshop track. Each uses a small, purpose-built image instead of a monolithic universal image, which means faster builds and no out-of-disk-space failures in GitHub Codespaces.

## Available Configurations

| Folder    | Name             | Language Track               | Base Image                         |
| --------- | ---------------- | ---------------------------- | ---------------------------------- |
| `node/`   | FanHub – Node.js | Node.js / Express / React    | `devcontainers/javascript-node:22` |
| `go/`     | FanHub – Go      | Go / Gin / React             | `devcontainers/go:1`               |
| `java/`   | FanHub – Java    | Java / Spring Boot / React   | `devcontainers/java:21`            |
| `dotnet/` | FanHub – .NET    | .NET / ASP.NET Core / Blazor | `devcontainers/dotnet:9`           |

> **Note:** Go, Java, and .NET configs also install Node.js (via the `node` devcontainer feature) to support their React frontends.

## What's Included in Every Config

### Tools

- ✅ **Docker-in-Docker** - Run `docker compose` commands inside the container
- ✅ **Git** - Version control
- ✅ **SQLite** - Lightweight file-based database (no server required)

### VS Code Extensions (all configs)

- ✅ **GitHub Copilot** + **Copilot Chat** - AI pair programming
- ✅ **ESLint** + **Prettier** - Linting and formatting
- ✅ **SQLite Viewer** - Browse database files
- ✅ **Docker** - Container management
- ✅ **Markdown Mermaid** + **Markdown All in One** - Documentation

Plus the language-specific extension for each track (Go tools, Java Pack, C# Dev Kit).

### Ports Forwarded

| Port | Service     |
| ---- | ----------- |
| 3000 | Frontend    |
| 5265 | Backend API |

## Using with GitHub Codespaces

GitHub Codespaces automatically detects multiple configurations in this directory and lets you choose which one to use when creating a codespace.

### Step-by-step

1. Go to the repository on GitHub
2. Click **"Code"** → **"Codespaces"** tab → **"New codespace"** (not just the green button)

   > If you use the quick green button it picks the default config. Use **"New codespace"** to choose.

3. In the **"Dev container configuration"** dropdown, select the language you want:
   - **FanHub – Node.js** → for `node/`
   - **FanHub – Go** → for `go/`
   - **FanHub – Java** → for `java/`
   - **FanHub – .NET** → for `dotnet/`

4. Choose your machine type (2-core is fine for most tracks) and click **"Create codespace"**

5. Wait ~2 minutes for the container to build

6. Once ready, open the terminal and follow the language-specific SETUP.md:

   ```bash
   cd node    # Node.js/Express
   cd go      # Go/Gin
   cd java    # Java/Spring Boot
   cd dotnet  # .NET/Blazor
   ```

7. Click the **"Ports"** tab in VS Code and open the forwarded port for your frontend

## Using with VS Code Dev Containers (Local)

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

   VS Code will show a picker listing all four configurations. Select your language track.

4. Wait for the container to build (~2 minutes first time — much faster than the old universal image)

5. Once the container is ready, navigate to your language folder and follow its `SETUP.md`

## Rebuilding the Container

If you make changes to a devcontainer config:

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

### Images

Each config uses a small, language-specific Microsoft devcontainer image rather than the large `universal:2` image. This avoids the "no space left on device" error that the universal image can trigger in Codespaces due to its size (~3GB+ compressed).

### Docker-in-Docker

Every config installs the `docker-in-docker` feature so you can run `docker compose` commands inside the container. This is needed by all four language implementations.

### Node.js in non-Node configs

Go, Java, and .NET configs add Node.js via the `ghcr.io/devcontainers/features/node:1` feature (pinned to v22) to support their React frontends.

### Database

All implementations use **SQLite** (file-based). No database server is needed — the database file lives alongside the application code.

### Workspace Mount

The repository is mounted at `/workspaces/<repo-name>` inside the container with full read/write access.

### Post-Create Command

After the container is created, a welcome message is displayed pointing to the language-specific setup guide.

## Advanced: Customizing a Dev Container

Edit the relevant `.devcontainer/<language>/devcontainer.json` to:

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
