# FanHub Go Backend

## ⚠️ WARNING: This Code Contains Intentional Bugs! ⚠️

This is a **workshop project** designed to teach GitHub Copilot usage. The code contains **~40 intentional bugs** that participants will fix using Copilot.

## Intentional Bugs Included

### Architecture Issues
- Global DB variable (no dependency injection)
- No graceful shutdown
- Missing context.Context usage
- No recovery middleware

### Configuration Issues (`config/config.go`)
- All global variables (anti-pattern)
- Hardcoded JWT secret fallback
- No validation of required values

### Model Issues (`models/`)
- Mixed JSON tags (inconsistent `omitempty`)
- Mixed pointer/value receivers
- No validation tags
- Inconsistent field naming
- Password hash exposed in JSON

### Database Issues (`database/db.go`)
- Global DB variable
- **Missing critical error checks**
- No defer for cleanup
- Mixed GORM and raw SQL

### Handler Issues (`handlers/`)
- **Missing `if err != nil` checks** (most common Go bug!)
- No context.Context propagation
- Inconsistent response formats
- Exposed error messages to client
- No input validation
- **SQL injection risk** in search (string concatenation)
- Auth on wrong path (`/auth` instead of `/api/auth`)

### Service Issues
- **Race condition** in `episode_service.go` (map without mutex)
- **Cache bug**: Doesn't include seasonID properly (like Java version)
- **Goroutine leak**: Background task with no cancellation
- No context usage
- Nil pointer dereference risks
- Weak password validation (only 6 chars)
- Incomplete JWT implementation (stub)

### Middleware Issues
- CORS wide open (allows all origins) - security issue!
- Auth middleware is stub only (not implemented)
- Missing recovery middleware

### Database Bug
- Duplicate "Jesse Pinkman" in seed data (test data issue)

## Tech Stack

- **Framework**: Gin 1.10+
- **ORM**: GORM 1.25+
- **Database**: PostgreSQL with pgx driver
- **Auth**: bcrypt + JWT (incomplete)
- **Language**: Go 1.21+

## Setup

1. **Install dependencies**:
   ```bash
   go mod download
   ```

2. **Set up PostgreSQL**:
   ```bash
   # Create database
   createdb fanhub
   
   # Run schema
   psql fanhub < database/schema.sql
   
   # Run seed data
   psql fanhub < database/seed.sql
   ```

3. **Configure environment** (copy `.env.example` to `.env`):
   ```bash
   cp .env.example .env
   ```

4. **Run the server**:
   ```bash
   go run main.go
   ```

Server runs on `http://localhost:8080`

## API Endpoints

### Shows
- `GET /api/shows` - List all shows
- `GET /api/shows/:id` - Get show by ID
- `POST /api/shows` - Create new show

### Characters
- `GET /api/characters` - List all characters
- `GET /api/characters/:id` - Get character by ID
- `GET /api/characters?search=name` - Search characters (has SQL injection bug!)
- `POST /api/characters` - Create new character

### Episodes
- `GET /api/episodes` - List all episodes
- `GET /api/episodes/:id` - Get episode by ID
- `GET /api/episodes?season_id=1` - Get episodes by season (has cache bug!)
- `POST /api/episodes` - Create new episode

### Quotes
- `GET /api/quotes` - List all quotes
- `GET /api/quotes?character_id=1` - Get quotes by character
- `POST /api/quotes` - Create new quote

### Auth (Note: inconsistent path - bug!)
- `POST /auth/register` - Register user (should be `/api/auth/register`)
- `POST /auth/login` - Login (should be `/api/auth/login`)

## Workshop Goals

Participants will use GitHub Copilot to:

1. Fix missing error checks (classic Go mistake)
2. Add proper context usage
3. Fix the race condition in episode cache
4. Fix SQL injection vulnerability
5. Implement proper JWT authentication
6. Add recovery middleware
7. Fix CORS configuration
8. Add input validation
9. Implement dependency injection
10. Add graceful shutdown
11. Fix inconsistent response formats
12. Remove exposed error messages
13. Fix the duplicate Jesse Pinkman bug

## License

MIT - For educational purposes only
