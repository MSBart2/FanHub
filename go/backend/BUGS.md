# FanHub Go Backend - Bug Inventory

## Complete List of Intentional Bugs (~42 bugs)

### 1. Main Application (`main.go`) - 4 bugs
- [ ] Global DB variable (no dependency injection)
- [ ] No graceful shutdown
- [ ] No context usage
- [ ] Missing recovery middleware (should use but doesn't)

### 2. Configuration (`config/config.go`) - 3 bugs
- [ ] All global variables (anti-pattern)
- [ ] Hardcoded JWT secret fallback ("super-secret-key-do-not-use-in-production")
- [ ] No validation of required configuration values

### 3. Database (`database/db.go`) - 3 bugs
- [ ] Global DB variable instead of struct/interface
- [ ] **CRITICAL**: Missing error check on `gorm.Open()` - code continues even if DB fails!
- [ ] Missing error handling in `CloseDB()`

### 4. Models - 12 bugs across 5 files

#### `models/character.go` - 3 bugs
- [ ] Mixed JSON tags (some use `omitempty`, some don't)
- [ ] Mixed pointer/value receivers (`IsAlive()` vs `GetDisplayName()`)
- [ ] No validation tags

#### `models/episode.go` - 3 bugs
- [ ] Inconsistent omitempty on JSON tags
- [ ] Mixed pointer usage (`AirDate` is pointer, but `Rating` isn't)
- [ ] No validation tags

#### `models/show.go` - 2 bugs
- [ ] Mixed pointer usage (`EndYear` is pointer but `StartYear` isn't)
- [ ] No validation tags

#### `models/quote.go` - 2 bugs
- [ ] Inconsistent omitempty usage
- [ ] No validation tags

#### `models/user.go` - 2 bugs
- [ ] **SECURITY**: Password hash exposed in JSON (should use `json:"-"`)
- [ ] No validation tags

### 5. Character Handler (`handlers/character_handler.go`) - 6 bugs
- [ ] **SQL INJECTION**: String concatenation in search query
- [ ] No context usage
- [ ] Missing `if err != nil` check in `GetCharacter()`
- [ ] Missing error check on `ShouldBindJSON()` in `CreateCharacter()`
- [ ] Exposes internal errors to client
- [ ] Inconsistent response format (some wrap in `data`, some don't)

### 6. Episode Handler (`handlers/episode_handler.go`) - 5 bugs
- [ ] No context propagation
- [ ] Ignoring error from `strconv.Atoi()`
- [ ] Missing error check on `DB.First()`
- [ ] Missing error check on `ShouldBindJSON()`
- [ ] Inconsistent response format

### 7. Show Handler (`handlers/show_handler.go`) - 4 bugs
- [ ] No error handling on DB operations
- [ ] Missing error check on `ShouldBindJSON()`
- [ ] Exposes internal errors
- [ ] No input validation

### 8. Quote Handler (`handlers/quote_handler.go`) - 4 bugs
- [ ] No error handling
- [ ] No context usage
- [ ] Missing error check on `ShouldBindJSON()`
- [ ] Inconsistent response format

### 9. Auth Handler (`handlers/auth_handler.go`) - 5 bugs
- [ ] **CRITICAL**: Path inconsistency - uses `/auth` instead of `/api/auth`
- [ ] No input validation
- [ ] Weak password requirements (delegated to service)
- [ ] Missing error checks on `ShouldBindJSON()`
- [ ] Exposes internal errors

### 10. Character Service (`services/character_service.go`) - 4 bugs
- [ ] No context.Context parameters
- [ ] **Nil pointer risk**: Returns nil without error check
- [ ] Missing error checks on DB operations
- [ ] Doesn't check `RowsAffected` in `UpdateCharacterStatus()`

### 11. Episode Service (`services/episode_service.go`) - 6 bugs
- [ ] **RACE CONDITION**: Global map cache without mutex
- [ ] **CACHE BUG**: Doesn't properly distinguish cache by seasonID (like Java bug)
- [ ] **GOROUTINE LEAK**: Background goroutine in `init()` with no cancellation
- [ ] No context usage
- [ ] Missing error checks on DB operations
- [ ] Doesn't invalidate cache when creating episodes

### 12. Auth Service (`services/auth_service.go`) - 5 bugs
- [ ] **Weak password**: Only 6 character minimum
- [ ] Missing error check on `bcrypt.GenerateFromPassword()`
- [ ] Missing error check on `DB.Where().First()`
- [ ] **Incomplete JWT**: Returns fake token instead of real JWT
- [ ] `ValidateToken()` function exists but not implemented

### 13. CORS Middleware (`middleware/cors.go`) - 3 bugs
- [ ] **SECURITY**: Allows all origins (`*`)
- [ ] Allows all methods
- [ ] Allows all headers

### 14. Auth Middleware (`middleware/auth.go`) - 1 bug
- [ ] **Stub only**: Completely unimplemented, just passes through

### 15. Database Data (`database/seed.sql`) - 1 bug
- [ ] Duplicate "Jesse Pinkman" entries (IDs 2 and 5)

## Bug Categories Summary

### Critical Security Issues (6)
1. SQL injection in character search
2. Hardcoded JWT secret
3. Password hash exposed in JSON
4. CORS allows all origins
5. Auth middleware not implemented
6. Weak password validation (6 chars)

### Classic Go Mistakes (8)
1. Missing `if err != nil` checks (multiple locations)
2. No context.Context usage
3. Race condition (map without mutex)
4. Goroutine leak
5. Mixed pointer/value receivers
6. Global variables instead of DI
7. No defer cleanup in places
8. Ignoring errors from functions

### Design Issues (8)
1. Global DB variable
2. No graceful shutdown
3. Missing recovery middleware
4. Inconsistent response formats
5. No input validation
6. Exposed error messages
7. All config as globals
8. No dependency injection

### Cache/Performance Bugs (3)
1. Cache doesn't distinguish seasons properly
2. No cache invalidation
3. Race condition in cache writes

### Data Integrity (1)
1. Duplicate Jesse Pinkman in seed data

### Incomplete Features (2)
1. JWT is fake/stub
2. Auth middleware is stub

### Code Quality Issues (14)
1. Mixed JSON tag styles
2. No validation tags
3. Inconsistent omitempty
4. Mixed pointer usage
5. No config validation
6. Path inconsistency (/auth vs /api/auth)
7. Multiple missing error checks
8. No context propagation
9. Nil pointer risks
10. No RowsAffected checks
11. Hardcoded values
12. No rate limiting
13. No timeout configuration
14. No structured logging

## Total: ~42 Intentional Bugs

This matches the Node.js (~36 bugs), .NET (~40 bugs), and Java (~46 bugs) implementations in complexity and educational value.
