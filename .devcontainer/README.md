# FanHub Dev Container

This directory contains the configuration for the **development container** used in GitHub Codespaces and VS Code Dev Containers.

## What's Included

### Pre-installed Tools
- ✅ **Node.js 18** - For running the FanHub backend and frontend
- ✅ **Docker-in-Docker** - Run containers inside the dev container
- ✅ **Git** - Version control
- ✅ **PostgreSQL client** - For database management

### VS Code Extensions
- ✅ **GitHub Copilot** - AI pair programming
- ✅ **GitHub Copilot Chat** - AI chat assistant
- ✅ **ESLint** - JavaScript/TypeScript linting
- ✅ **Prettier** - Code formatting
- ✅ **Docker** - Container management
- ✅ **Markdown Mermaid** - Diagram rendering
- ✅ **Markdown All in One** - Enhanced markdown editing

### Ports Forwarded
- **3000** - Frontend (React app)
- **3001** - Backend API (Express)
- **5432** - PostgreSQL database

## Using with GitHub Codespaces

1. Click **"Code"** → **"Create codespace on main"** in the GitHub repository
2. Wait 2-3 minutes for the environment to build
3. Once ready, run:
   ```bash
   cd fanhub
   npm run install:all
   npm start
   ```
4. Click the **"Ports"** tab and open port 3000

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

5. Once the container is ready, open a terminal and run:
   ```bash
   cd fanhub
   npm run install:all
   npm start
   ```

6. Access the app at http://localhost:3000

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
- Or change port mappings in `docker-compose.yml`

### Extensions not loading
- Reload window: `F1` → **"Developer: Reload Window"**
- Check VS Code is up to date (1.107+)

### Database connection fails
- Ensure Docker is running
- Try: `docker ps` to see if PostgreSQL container is running
- Reset database: `npm run db:reset`

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
- Provides consistent baseline for learning

## Configuration Details

### Base Image
The dev container uses the Node.js 18 feature with Docker-in-Docker support, allowing you to run the FanHub application containers inside the development container.

### Workspace Mount
The repository is mounted at `/workspace` inside the container with full read/write access.

### User
Runs as the `node` user (non-root) for security.

### Post-Create Command
After the container is created, a welcome message is displayed with next steps.

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
