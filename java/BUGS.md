# FanHub Java - Known Bugs & Issues

> **Purpose**: This document catalogs intentional bugs, misconfigurations, and code quality issues in the FanHub Java/Spring Boot workshop starter project. These are designed for learning purposes - participants will fix them using AI-assisted development techniques.

---

## 🔴 Critical Bugs

### 1. **Duplicate Character Data in Seed File**
**Location**: `backend/src/main/resources/seed.sql` (lines 36 and 39)
**Type**: Data Integrity Bug
**Impact**: Page-breaking

**Description**: 
- Jesse Pinkman appears TWICE in the characters table with different IDs (2 and 5)
- Both entries have slightly different bio text
- Quotes reference different Jesse IDs inconsistently
- This causes duplicate characters to appear in the UI

**Evidence**:
```sql
-- Line 36
(1, 'Jesse Pinkman', 'Aaron Paul', 'Walt''s former student and business partner...', true, 'alive'),
-- Line 39 - DUPLICATE!
(1, 'Jesse Pinkman', 'Aaron Paul', 'Walt''s former student and partner in the methamphetamine business.', true, 'alive'),
```

**User Impact**: 
- Characters page shows two Jesse Pinkman cards
- Character detail pages show incomplete data

---

### 2. **Episode Cache Ignores Season Filter**
**Location**: `backend/src/main/java/com/fanhub/service/EpisodeService.java` (line 26)
**Type**: Logic Bug
**Impact**: Data Display Bug

**Description**:
- `@Cacheable` annotation doesn't include `seasonId` in the cache key
- When user filters by season, they might see ALL episodes from cache
- Cache key doesn't account for the `seasonId` parameter

**Evidence**:
```java
// BUG: Cache key doesn't include seasonId parameter
@Cacheable(value = "episodes")
public List<Episode> getEpisodesBySeasonId(Long seasonId) {
    return episodeRepository.findBySeasonId(seasonId);
}
```

**Fix**: Should use `@Cacheable(value = "episodes", key = "#seasonId")`

**User Impact**:
- Season filter appears broken
- Clicking "Season 2" might show Season 1 episodes from cache

---

### 3. **Inconsistent API Path Structure**
**Location**: `backend/src/main/java/com/fanhub/controller/AuthController.java` (line 16)
**Type**: API Design Bug
**Impact**: Developer Experience

**Description**:
- Most controllers use `/api/*` prefix
- AuthController uses `/auth` (no `/api` prefix)
- Creates confusion and inconsistent API design

**Evidence**:
```java
// Most controllers
@RequestMapping("/api/characters")
@RequestMapping("/api/episodes")
@RequestMapping("/api/shows")

// AuthController - INCONSISTENT
@RequestMapping("/auth")  // No /api prefix!
```

---

## ⚠️ High Priority Issues

### 4. **Missing Error Handling in CharacterController**
**Location**: `backend/src/main/java/com/fanhub/controller/CharacterController.java` (lines 22-32)
**Type**: Error Handling Bug

**Description**:
- `getAllCharacters()` endpoint has no try-catch block
- Will expose raw exceptions to the client
- Other endpoints have mixed error handling approaches

**Evidence**:
```java
@GetMapping
public List<Character> getAllCharacters(...) {
    // No try-catch - raw exceptions exposed!
    return characterService.getAllCharacters();
}
```

---

### 5. **Optional.get() Without isPresent() Check**
**Location**: `backend/src/main/java/com/fanhub/service/CharacterService.java` (line 24)
**Type**: NullPointerException Risk

**Description**:
- Using `.get()` without checking `.isPresent()` first
- Will throw `NoSuchElementException` if character doesn't exist

**Evidence**:
```java
public Character getCharacterById(Long id) {
    // BUG: No check if Optional is empty
    return characterRepository.findById(id).get();
}
```

---

### 6. **Mixed HTTP Status Codes for Create Operations**
**Location**: Multiple controller files
**Type**: API Consistency Bug

**Description**:
- `ShowController.createShow()`: Returns 201 (correct)
- `CharacterController.createCharacter()`: Returns 200 (incorrect)
- `EpisodeController.createEpisode()`: Returns 201 (correct)
- `QuoteController.createQuote()`: Returns 200 (incorrect)

**Evidence**:
```java
// CharacterController - Wrong!
@PostMapping
public Character createCharacter(@RequestBody Character character) {
    return characterService.createCharacter(character);  // Returns 200
}

// ShowController - Correct!
@PostMapping
public ResponseEntity<Show> createShow(@RequestBody Show show) {
    return ResponseEntity.status(201).body(created);  // Returns 201
}
```

---

### 7. **Weak Password Requirements**
**Location**: `backend/src/main/java/com/fanhub/controller/AuthController.java` (line 31)
**Type**: Security Bug

**Description**:
- Password only requires 6 characters minimum
- No complexity requirements

**Evidence**:
```java
if (password == null || password.length() < 6) {
    // Only 6 characters required!
}
```

---

### 8. **CORS Wide Open**
**Location**: Multiple files
**Type**: Security Configuration

**Description**:
- CORS enabled for all origins with `@CrossOrigin(origins = "*")`
- Also configured globally in `WebConfig.java`

**Evidence**:
```java
// Every controller
@CrossOrigin(origins = "*")  // Wide open!

// WebConfig.java
.allowedOrigins("*")
```

---

### 9. **Spring Security Allows All Requests**
**Location**: `backend/src/main/java/com/fanhub/config/SecurityConfig.java` (line 18)
**Type**: Security Bug

**Description**:
- All endpoints are public (`.anyRequest().permitAll()`)
- No authentication required
- CSRF disabled

**Evidence**:
```java
.authorizeHttpRequests(auth -> auth
    .anyRequest().permitAll()  // Everything is public!
);
```

---

### 10. **Exposed Error Details in Production**
**Location**: `backend/src/main/java/com/fanhub/controller/ShowController.java` (line 38)
**Type**: Security Bug

**Description**:
- Exception messages exposed to client in all environments

**Evidence**:
```java
catch (Exception e) {
    error.put("error", e.getMessage());  // Exposing internals!
    return ResponseEntity.status(500).body(error);
}
```

---

## 🟡 Medium Priority Issues

### 11. **Mixed Lombok Usage**
**Location**: Model classes
**Type**: Code Inconsistency

**Description**:
- `Character.java`: Uses `@Data`
- `Episode.java`: Uses `@Getter`/`@Setter`
- `Show.java`: Manual getters/setters (no Lombok)
- `User.java`: Manual getters/setters

**Evidence**:
```java
// Character.java
@Data  // Full Lombok

// Episode.java
@Getter @Setter  // Partial Lombok

// Show.java
// No Lombok - manual getters/setters
```

---

### 12. **Mixed Dependency Injection Patterns**
**Location**: Service and Controller classes
**Type**: Code Consistency

**Description**:
- `CharacterService`: Field injection with `@Autowired`
- `EpisodeService`: Constructor injection
- `ShowService`: Constructor injection
- `QuoteService`: Field injection

**Evidence**:
```java
// CharacterService - Field injection
@Autowired
private CharacterRepository characterRepository;

// EpisodeService - Constructor injection
public EpisodeService(EpisodeRepository episodeRepository) {
    this.episodeRepository = episodeRepository;
}
```

---

### 13. **Inconsistent Response Formats**
**Location**: Multiple controller files
**Type**: API Design Bug

**Description**:
- `CharacterController`: Returns raw `List<Character>`
- `EpisodeController`: Returns `Map<String, Object>` with `{success, count, data}`
- `ShowController`: Returns raw `List<Show>` for GET all, but `Map` for errors
- `QuoteController`: Returns raw objects

**Examples**:
```java
// CharacterController
public List<Character> getAllCharacters()  // Raw list

// EpisodeController
public Map<String, Object> getEpisodes()  // Wrapped response
response.put("success", true);
response.put("data", episodes);
```

---

### 14. **Mixed Update Methods (PUT vs PATCH)**
**Location**: Controller files
**Type**: REST API Inconsistency

**Description**:
- `CharacterController`: Uses `@PatchMapping`
- `ShowController`: Uses `@PutMapping`
- `EpisodeController`: Uses `@PutMapping`

**Evidence**:
```java
// CharacterController
@PatchMapping("/{id}")

// ShowController
@PutMapping("/{id}")
```

---

### 15. **Missing @Repository Annotations**
**Location**: `CharacterRepository.java`, `UserRepository.java`
**Type**: Code Consistency

**Description**:
- `ShowRepository`: Has `@Repository`
- `CharacterRepository`: Missing `@Repository`
- `EpisodeRepository`: Has `@Repository`
- `UserRepository`: Missing `@Repository`

---

### 16. **No Null Checks on Service Methods**
**Location**: Multiple service classes
**Type**: Input Validation

**Description**:
- `CharacterService.searchCharacters()`: No null check on `query`
- `ShowService.createShow()`: No validation that title is not empty
- No validation of required fields

**Evidence**:
```java
public List<Character> searchCharacters(String query) {
    // No null check - will NPE if query is null
    return characterRepository.findByNameContainingIgnoreCase(query);
}
```

---

### 17. **Using Double Instead of BigDecimal for Rating**
**Location**: `backend/src/main/java/com/fanhub/model/Episode.java` (line 44)
**Type**: Data Precision Bug

**Description**:
- Using `Double` for rating instead of `BigDecimal`
- Can cause precision issues

**Evidence**:
```java
// INTENTIONAL BUG: Using Double instead of BigDecimal
private Double rating;
```

---

### 18. **Incomplete Authentication Implementation**
**Location**: `backend/src/main/java/com/fanhub/controller/AuthController.java`
**Type**: Implementation Gap

**Description**:
- No JWT token generation (returns "not_implemented")
- Missing logout endpoint
- Missing token refresh endpoint
- Missing forgot password endpoint
- No email format validation
- No check if user already exists during registration

**Evidence**:
```java
response.put("token", "not_implemented");  // TODO!

// INTENTIONAL BUG: Missing logout endpoint
// INTENTIONAL BUG: Missing token refresh endpoint
```

---

### 19. **BCryptPasswordEncoder Created in Controller**
**Location**: `backend/src/main/java/com/fanhub/controller/AuthController.java` (line 23)
**Type**: Design Bug

**Description**:
- Creating `BCryptPasswordEncoder` instance in controller instead of injecting the bean

**Evidence**:
```java
// Wrong - creates new instance
private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

// Should inject the bean from SecurityConfig
```

---

### 20. **No Transaction Management**
**Location**: Service classes
**Type**: Data Integrity Risk

**Description**:
- No `@Transactional` annotations on service methods
- Could cause issues with multi-step operations

---

## 🟢 Low Priority / Code Quality Issues

### 21. **No Pagination on List Endpoints**
**Location**: All controller classes
**Type**: Performance/Scalability Gap

**Description**:
- All `findAll()` calls return ALL records
- No page size limits
- Could cause performance issues with large datasets

**Evidence**:
```java
public List<Character> getAllCharacters() {
    return characterRepository.findAll();  // No pagination!
}
```

---

### 22. **Verbose Logging in Production**
**Location**: `backend/src/main/resources/application.properties` (lines 26-28)
**Type**: Configuration Issue

**Description**:
- DEBUG level logging enabled by default
- SQL queries logged
- Too verbose for production

**Evidence**:
```properties
logging.level.com.fanhub=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

---

### 23. **Using Deprecated SQL Initialization Property**
**Location**: `backend/src/main/resources/application.properties` (line 18)
**Type**: Configuration Issue

**Description**:
- Using `spring.sql.init.*` which is deprecated
- Should use Flyway or Liquibase for production

**Evidence**:
```properties
spring.sql.init.mode=always  # Deprecated approach
```

---

### 24. **Weak JWT Secret in Properties**
**Location**: `backend/src/main/resources/application.properties` (line 24)
**Type**: Security Risk

**Description**:
- Default JWT secret is weak and visible
- No validation that it's changed in production

**Evidence**:
```properties
jwt.secret=${JWT_SECRET:change_this_in_production}
```

---

### 25. **Running Docker Container as Root**
**Location**: `backend/Dockerfile`
**Type**: Security Issue

**Description**:
- Container runs as root user
- Should use non-root user

---

### 26. **No Request ID for Logging**
**Location**: No request logging configured
**Type**: Observability Gap

**Description**:
- No request correlation IDs
- Makes debugging concurrent requests difficult

---

### 27. **No Validation Annotations Used**
**Location**: Model and DTO classes
**Type**: Input Validation Gap

**Description**:
- No Bean Validation annotations (`@NotNull`, `@Size`, etc.)
- Validation done manually in controllers (inconsistently)

---

### 28. **CharacterRepository.findByName Returns Single Object**
**Location**: `backend/src/main/java/com/fanhub/repository/CharacterRepository.java` (line 12)
**Type**: Design Bug

**Description**:
- Method assumes character names are unique
- With duplicate Jesse Pinkman, this returns only one

**Evidence**:
```java
// BUG: Assumes unique names, but Jesse Pinkman is duplicated!
Character findByName(String name);
```

---

### 29. **No Custom Exception Classes**
**Location**: Entire codebase
**Type**: Error Handling Gap

**Description**:
- Using generic exceptions
- No custom exception hierarchy
- Makes error handling inconsistent

---

### 30. **No Environment-Specific Configuration**
**Location**: `backend/src/main/resources/`
**Type**: Configuration Gap

**Description**:
- Only one `application.properties` file
- No `application-dev.properties` or `application-prod.properties`

---

## 📊 Configuration Issues

### 31. **No Profile-Specific Properties**
**Location**: `backend/src/main/resources/application.properties`
**Type**: Configuration Gap

**Description**:
- Comment says "No profile-specific configuration"
- Dev and prod use same settings

---

### 32. **Different Frontend Port in Docker**
**Location**: `docker-compose.yml` and `frontend/package.json`
**Type**: Configuration Inconsistency

**Description**:
- PORT set to 3002 to avoid conflicts with Node (3000) and .NET (3001)
- Requires updating API proxy configuration

---

## 🔧 Missing Features (Documented as TODO)

### 33. **No Tests Configured**
**Location**: `backend/src/test/java/`
- Directory exists but is empty
- No unit tests, integration tests, or test configuration

### 34. **No API Documentation**
**Location**: Entire codebase
- No Swagger/OpenAPI configuration
- No JavaDoc comments

### 35. **No DTO Layer Consistency**
**Location**: `backend/src/main/java/com/fanhub/dto/`
- Directory exists but is empty
- Controllers return entities directly (security risk)

---

## 📝 Summary by Category

| Category | Count |
|----------|-------|
| **Critical Bugs** | 3 |
| **High Priority** | 10 |
| **Medium Priority** | 10 |
| **Low Priority** | 8 |
| **Configuration Issues** | 2 |
| **Missing Features** | 3 |
| **TOTAL** | **36+** |

---

## 🎯 Workshop Learning Objectives

These bugs are **intentionally designed** to teach:

1. **Spring Boot best practices** - Proper dependency injection, configuration
2. **JPA optimization** - Avoiding N+1 queries, proper caching
3. **API design consistency** - REST conventions, status codes, response formats
4. **Error handling patterns** - Custom exceptions, proper HTTP responses
5. **Security hardening** - Spring Security, JWT, password validation
6. **Code organization** - Consistent use of Lombok, proper layering
7. **Testing** - Unit tests, integration tests with Spring Boot Test
8. **Java modern patterns** - Optional handling, Stream API, functional programming

---

## 🔍 Detection Tips for Workshop Participants

**To find these bugs:**
1. Run the application and test each feature
2. Use Spring Boot Actuator to inspect beans and configuration
3. Check for inconsistent patterns across similar files
4. Look for missing `@Transactional` annotations
5. Search for `.get()` on Optional without `.isPresent()`
6. Review exception handling in controllers
7. Test edge cases (missing data, invalid inputs)

**AI assistance can help:**
- "Scan for Optional.get() usage without isPresent() checks"
- "Find missing error handling in Spring controllers"
- "Identify security vulnerabilities in Spring Security config"
- "Suggest API design improvements for REST endpoints"
- "Find inconsistent dependency injection patterns"

---

**Last Updated**: 2026-02-05  
**For**: FanHub Workshop - Java Implementation
