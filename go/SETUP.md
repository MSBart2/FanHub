# FanHub Go Setup Guide

Welcome to the Go/Gin implementation of the FanHub workshop! This guide will help you get the application running.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Go 1.21+** ([Download](https://go.dev/dl/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Node.js 18+** (for frontend) ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/downloads))
- **VS Code** with GitHub Copilot extension ([Get Copilot](https://github.com/features/copilot))

### Verify Installation

```bash
go version        # Should show Go 1.21 or higher
docker --version  # Should show Docker 20.10 or higher
node --version    # Should show Node 18 or higher
```

## Quick Start (Docker - Recommended)

The easiest way to get started is using Docker Compose:

### 1. Navigate to the Go directory

```bash
cd go
```

### 2. Create environment file

```bash
cp .env.example .env
```

### 3. Start all services

```bash
docker-compose up --build
```

This will start:
- **PostgreSQL** database on port `5435`
- **Go backend** API on port `8090`
- **React frontend** on port `3003`

### 4. Access the application

- **Frontend**: http://localhost:3003
- **Backend API**: http://localhost:8090/api/shows

### 5. Stop the services

```bash
docker-compose down
```

To remove volumes (database data):

```bash
docker-compose down -v
```

---

## Local Development Setup

For active development and debugging, you can run services locally:

### Backend Setup

#### 1. Navigate to backend directory

```bash
cd go/backend
```

#### 2. Install dependencies

```bash
go mod download
```

#### 3. Set up PostgreSQL

Option A - Use Docker for DB only:

```bash
docker run -d \
  --name fanhub-go-db \
  -e POSTGRES_DB=fanhub \
  -e POSTGRES_USER=fanhub \
  -e POSTGRES_PASSWORD=fanhub123 \
  -p 5435:5432 \
  postgres:15-alpine
```

Option B - Use local PostgreSQL:

```sql
CREATE DATABASE fanhub;
CREATE USER fanhub WITH PASSWORD 'fanhub123';
GRANT ALL PRIVILEGES ON DATABASE fanhub TO fanhub;
```

#### 4. Run database migrations

The application will auto-migrate on startup, or you can use psql:

```bash
psql -h localhost -p 5435 -U fanhub -d fanhub -f database/schema.sql
psql -h localhost -p 5435 -U fanhub -d fanhub -f database/seed.sql
```

#### 5. Configure environment

Create `.env` file in `backend/` directory:

```env
DATABASE_URL=postgres://fanhub:fanhub123@localhost:5435/fanhub?sslmode=disable
PORT=8090
GIN_MODE=debug
JWT_SECRET=your-secret-key-change-in-production
```

#### 6. Run the backend

```bash
go run main.go
```

The API will be available at http://localhost:8090

#### 7. Run with hot reload (Optional)

Install Air for hot reloading:

```bash
go install github.com/cosmtrek/air@latest
air
```

### Frontend Setup

#### 1. Navigate to frontend directory

```bash
cd go/frontend
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Set environment variables

Create `.env` file:

```env
REACT_APP_API_URL=http://localhost:8090
PORT=3003
```

#### 4. Start the development server

```bash
npm start
```

The frontend will open at http://localhost:3003

---

## Available API Endpoints

### Characters
- `GET /api/characters` - List all characters
- `GET /api/characters/:id` - Get character by ID
- `GET /api/characters/search?name=Walter` - Search characters (has SQL injection bug!)
- `POST /api/characters` - Create a new character

### Episodes
- `GET /api/episodes` - List all episodes (pagination missing)
- `GET /api/episodes?seasonId=1` - Filter by season (cache bug!)
- `GET /api/episodes/:id` - Get episode by ID
- `POST /api/episodes` - Create a new episode

### Shows
- `GET /api/shows` - List all shows
- `GET /api/shows/:id` - Get show by ID
- `POST /api/shows` - Create a new show

### Quotes
- `GET /api/quotes` - List all quotes
- `GET /api/quotes/random` - Get a random quote
- `POST /api/quotes` - Create a new quote

### Authentication (Incomplete)
- `POST /auth/register` - Register a new user (weak password validation!)
- `POST /auth/login` - Login (incomplete JWT implementation)

---

## Testing the Application

### Manual Testing

#### 1. View all characters

```bash
curl http://localhost:8090/api/characters
```

Expected: List of characters including **duplicate Jesse Pinkman** entries (bug!)

#### 2. Test cache bug

```bash
# Request episodes for season 1
curl http://localhost:8090/api/episodes?seasonId=1

# Request episodes for season 2
curl http://localhost:8090/api/episodes?seasonId=2
```

Expected: Both return season 1 episodes due to cache bug

#### 3. Test SQL injection vulnerability

```bash
curl "http://localhost:8090/api/characters/search?name='; DROP TABLE characters; --"
```

Expected: Shows SQL error (demonstrates vulnerability)

### Run with Race Detector

Go has built-in race detection. Run with:

```bash
go run -race main.go
```

Expected: Detects race condition in episode cache

### Load Testing (Optional)

```bash
# Install hey
go install github.com/rakyll/hey@latest

# Test cache race condition
hey -n 1000 -c 10 http://localhost:8090/api/episodes?seasonId=1
```

---

## Debugging Tips

### Enable Debug Logging

Set `GIN_MODE=debug` in your `.env` file:

```env
GIN_MODE=debug
```

### Check Database Connection

```bash
# Connect to PostgreSQL
docker exec -it fanhub-go-db psql -U fanhub -d fanhub

# Run queries
SELECT * FROM characters WHERE name LIKE '%Jesse%';
\q  # Exit
```

### View Container Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Common Issues

#### Port Already in Use

If ports 8090, 3003, or 5435 are already in use:

```bash
# Find process using the port (Windows)
netstat -ano | findstr :8090

# Kill the process
taskkill /PID <PID> /F

# Or change ports in docker-compose.yml and .env
```

#### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart database
docker-compose restart db

# Check logs
docker-compose logs db
```

#### Go Module Issues

```bash
# Clear module cache
go clean -modcache

# Re-download dependencies
go mod download

# Tidy dependencies
go mod tidy
```

#### Frontend Proxy Not Working

Ensure `package.json` has:

```json
{
  "proxy": "http://localhost:8090"
}
```

If still not working, use direct API calls with full URL in React code.

---

## Workshop Learning Path

This implementation contains **~42 intentional bugs** for learning purposes!

### Recommended Bug Hunting Order:

1. **Critical Security (Start Here!)**
   - SQL injection in character search
   - Hardcoded JWT secret
   - CORS wide open
   - Auth middleware not implemented

2. **Classic Go Mistakes**
   - Missing `if err != nil` checks (most important!)
   - Race condition in cache (run with `-race`)
   - Goroutine leak in episode service
   - No context.Context propagation

3. **Design Issues**
   - Global database variable
   - Mixed pointer/value receivers
   - Inconsistent JSON tags
   - No input validation

4. **Performance**
   - Cache doesn't use seasonID in key
   - Missing pagination
   - N+1 query problems

5. **Code Quality**
   - Exposed error messages
   - Inconsistent naming
   - Missing documentation
   - No tests

### Using GitHub Copilot

Throughout the workshop, use Copilot to:
- Identify bugs using Copilot Chat: *"Find security vulnerabilities in this file"*
- Get fix suggestions: *"How should I handle this error?"*
- Refactor code: *"Refactor this to use context.Context"*
- Write tests: *"Generate unit tests for this handler"*

---

## Next Steps

1. ✅ Get the application running
2. 📖 Read [BUGS.md](./BUGS.md) to understand intentional issues
3. 🐛 Start fixing bugs using GitHub Copilot
4. 🧪 Add tests to verify your fixes
5. 📝 Document your learnings

For detailed bug information, see [BUGS.md](./BUGS.md).

For workshop challenges, see [WORKSHOP.md](./WORKSHOP.md).

Happy coding! 🚀
