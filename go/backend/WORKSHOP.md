# FanHub Go Workshop - Quick Start Guide

## Prerequisites

- Go 1.21 or higher
- PostgreSQL 14+
- A PostgreSQL client (psql, pgAdmin, etc.)

## Setup Steps

### 1. Install Go (if not already installed)

**Windows**:
```powershell
winget install GoLang.Go
```

**macOS**:
```bash
brew install go
```

**Linux**:
```bash
sudo apt install golang-go
```

### 2. Clone and Navigate

```bash
cd C:\Users\rmathis\source\FanHub\go\backend
```

### 3. Install Dependencies

```bash
go mod download
```

### 4. Set Up PostgreSQL Database

**Create Database**:
```bash
# Using psql
psql -U postgres
CREATE DATABASE fanhub;
\q
```

**Run Schema**:
```bash
psql -U postgres -d fanhub -f database/schema.sql
```

**Load Seed Data**:
```bash
psql -U postgres -d fanhub -f database/seed.sql
```

### 5. Configure Environment

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` if your PostgreSQL settings differ:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=fanhub
PORT=8080
JWT_SECRET=super-secret-key-do-not-use-in-production
```

### 6. Run the Server

```bash
go run main.go
```

You should see:
```
Server starting on port 8080
Database connection established
```

**Note**: The database connection might fail silently due to bugs! Check for errors.

### 7. Test the API

```bash
# Get all shows
curl http://localhost:8080/api/shows

# Get all characters
curl http://localhost:8080/api/characters

# Test search (has SQL injection bug!)
curl "http://localhost:8080/api/characters?search=Walter"

# Register a user (weak password validation!)
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","username":"testuser","display_name":"Test User"}'
```

## Workshop Challenges

### Challenge 1: Fix Critical Error Handling
**Goal**: Find and fix missing `if err != nil` checks
**Hint**: Look in `database/db.go` first - the app might not even connect to the database!

### Challenge 2: Fix SQL Injection
**Goal**: Fix the SQL injection vulnerability in character search
**File**: `handlers/character_handler.go`
**Hint**: Never concatenate user input into SQL queries

### Challenge 3: Fix Race Condition
**Goal**: Fix the race condition in episode caching
**File**: `services/episode_service.go`
**Hint**: Use `sync.RWMutex`

### Challenge 4: Fix Goroutine Leak
**Goal**: Stop the goroutine leak in episode service
**File**: `services/episode_service.go`
**Hint**: Remove or fix the `init()` function

### Challenge 5: Fix Cache Bug
**Goal**: Fix cache key to properly distinguish between seasons
**File**: `services/episode_service.go`
**Hint**: The cache uses only seasonID but should use something more unique

### Challenge 6: Implement JWT Authentication
**Goal**: Replace fake JWT with real implementation
**File**: `services/auth_service.go`
**Hint**: Use `github.com/golang-jwt/jwt/v5`

### Challenge 7: Implement Auth Middleware
**Goal**: Implement actual JWT validation
**File**: `middleware/auth.go`
**Hint**: Extract token from Authorization header, validate it

### Challenge 8: Fix CORS
**Goal**: Restrict CORS to specific origins
**File**: `middleware/cors.go`
**Hint**: Don't use `*` - configure allowed origins properly

### Challenge 9: Add Recovery Middleware
**Goal**: Add panic recovery middleware to Gin
**File**: `main.go`
**Hint**: Gin has built-in recovery middleware

### Challenge 10: Fix Password Security
**Goal**: Strengthen password requirements and fix exposed password hash
**Files**: `services/auth_service.go`, `models/user.go`
**Hint**: Minimum 8-12 characters, use `json:"-"` to hide fields

### Challenge 11: Add Graceful Shutdown
**Goal**: Implement graceful shutdown with context
**File**: `main.go`
**Hint**: Use `signal.Notify()` and `context.WithTimeout()`

### Challenge 12: Add Dependency Injection
**Goal**: Remove global DB variable
**Files**: `database/db.go`, all handlers and services
**Hint**: Create a struct to hold DB, pass it to handlers

### Challenge 13: Add Context Propagation
**Goal**: Add context.Context to all service functions
**Files**: All service files
**Hint**: First parameter should be `ctx context.Context`

### Challenge 14: Fix Inconsistent Response Format
**Goal**: Standardize API responses
**Files**: All handler files
**Hint**: Always wrap in consistent structure or never wrap

### Challenge 15: Fix the Duplicate Jesse
**Goal**: Find and fix the duplicate character in seed data
**File**: `database/seed.sql`
**Hint**: Look for "Jesse Pinkman"

## Tips for Using GitHub Copilot

1. **Comment-driven development**: Write a comment describing what you want, let Copilot suggest the code
2. **Use inline chat**: Select buggy code, press `Ctrl+I`, ask "fix this bug"
3. **Ask for explanations**: Highlight code and ask "what's wrong with this?"
4. **Request tests**: Ask Copilot to generate tests for your fixes
5. **Pattern matching**: Fix one bug, then ask Copilot to "fix similar issues in other files"

## Testing Your Fixes

After each fix, restart the server and test:

```bash
# Stop server (Ctrl+C)
# Restart
go run main.go

# Test endpoints
curl http://localhost:8080/api/characters
curl http://localhost:8080/api/episodes?season_id=1
```

## Building for Production

```bash
# Build binary
go build -o fanhub-server main.go

# Run binary
./fanhub-server
```

## Troubleshooting

**Database connection fails**: Check if PostgreSQL is running and credentials are correct

**Port already in use**: Change PORT in `.env`

**Panic on startup**: This might be due to bugs - start fixing them!

**Nil pointer errors**: Check for missing error handling

**Race detector**: Run with race detector to find concurrency bugs
```bash
go run -race main.go
```

## Next Steps

Once you've fixed the bugs:
1. Add unit tests
2. Add integration tests
3. Implement remaining CRUD operations
4. Add search functionality (properly!)
5. Add pagination
6. Add rate limiting
7. Add logging
8. Add metrics
9. Deploy to production!

Good luck! 🚀
