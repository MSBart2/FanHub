# FanHub - Java/Spring Boot Workshop Starter

> ⚠️ **Workshop Material**: This is an intentionally flawed codebase designed for GitHub Copilot training workshops. Contains 36+ bugs by design.

A generic fan site application for TV shows featuring characters, episodes, quotes, and user authentication. Built with **Spring Boot**, **React**, and **SQLite**.

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [What's Missing: The Copilot Configurations](#-whats-missing-the-copilot-configurations)
- [Architecture Overview](#-architecture-overview)
- [Known Issues](#-known-issues)
- [Workshop Learning Path](#-workshop-learning-path)
- [Project Structure](#-project-structure)
- [Development](#-development)

---

## 🚀 Quick Start

### Prerequisites

- **Java 17+**
- **Docker Desktop**
- **Node.js 18+**
- **Git**

### Installation

```bash
# Start all services with Docker
cd java
npm start

# Application URLs:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5265
# Database: SQLite file at /data/fanhub.db inside the backend container
```

### First Time Setup

```bash
# Copy environment variables
cp .env.example .env

# Start services
docker-compose up

# In another terminal, verify the database
docker exec -it fanhub-java-backend sqlite3 /data/fanhub.db "SELECT COUNT(*) FROM characters;"
```

### Stop Services

```bash
npm stop
# OR
docker-compose down
```

📖 **[Complete Setup Guide →](SETUP.md)**

---

## ❌ What's Missing: The Copilot Configurations

This codebase is **intentionally unconfigured** for GitHub Copilot. The workshop teaches you to add these configurations and see Copilot's suggestions improve dramatically.

### Missing Configuration Files

This Java implementation has the same missing Copilot configurations as the Node.js version:

#### 1. ❌ Repository Instructions (Module 1)

**File**: `.github/copilot-instructions.md`

**What's needed for Java:**

```markdown
# FanHub - Breaking Bad Fan Site (Java/Spring Boot)

Tech Stack: Spring Boot 3.2, Spring Data JPA, Spring Security, SQLite, React
Framework patterns: REST controllers, Service layer, JPA repositories
Dependency Injection: Constructor injection (preferred)
Error handling: Custom exceptions with @ControllerAdvice
Database: JPA entities with Hibernate
Testing: JUnit 5, Mockito, Spring Boot Test
...
```

#### 2. ❌ Custom Prompts Library (Module 3)

**Example Java-specific prompts:**

- `spring-controller.prompt` - Generate REST controllers
- `jpa-repository.prompt` - Create Spring Data repositories
- `test-service.prompt` - Generate service layer tests
- `dto-mapper.prompt` - Create DTO classes with MapStruct

#### 3. ❌ Custom Instructions (Module 4)

**Example Java-specific instructions:**

```markdown
# File: .github/instructions/spring-controllers.md

applyTo: \*_/controller/_.java

All Spring REST controllers must:

- Use constructor injection (not @Autowired field injection)
- Return ResponseEntity for explicit status codes
- Use @RestController and @RequestMapping
- Include @CrossOrigin only in dev
- Wrap in try-catch with @ControllerAdvice
- Return 201 for POST, 200 for GET/PUT, 204 for DELETE
```

```markdown
# File: .github/instructions/jpa-entities.md

applyTo: \*_/model/_.java

All JPA entities must:

- Use Lombok @Data or @Getter/@Setter consistently
- Include @Entity and @Table annotations
- Use @Id with @GeneratedValue(strategy = IDENTITY)
- Use appropriate column types (BigDecimal for money, LocalDateTime for dates)
- Include audit fields (createdAt, updatedAt) with @CreatedDate/@LastModifiedDate
```

#### 4. ❌ Agent Skills (Module 5)

**Java-specific domain knowledge:**

```markdown
skill-type: framework-expertise
domain: spring-boot-best-practices

# Spring Boot Best Practices

## Dependency Injection

- Prefer constructor injection over field injection
- Use final fields with constructor injection
- Avoid @Autowired on fields

## Exception Handling

- Create custom exception classes
- Use @ControllerAdvice for global exception handling
- Return proper HTTP status codes

## JPA Optimization

- Use @Transactional on service methods
- Avoid N+1 queries with @EntityGraph or JOIN FETCH
- Use projections for read-only queries
  ...
```

---

## 🏗️ Architecture Overview

### Tech Stack

**Backend**:

- Spring Boot 3.2.2
- Spring Data JPA with Hibernate
- Spring Security (incomplete implementation)
- SQLite via the `sqlite-jdbc` driver (file-backed, no separate database service)
- JWT authentication (not implemented)
- BCrypt for password hashing
- Lombok (inconsistently applied)

**Frontend**:

- React 18.2 with React Router 6
- Styled-components (inconsistently applied)
- Axios for API calls
- No state management library

**Infrastructure**:

- Docker Compose for local development
- SQLite database (file-backed at `/data/fanhub.db`)
- Maven for build management
- No CI/CD configured

### Database Schema

```
shows → seasons → episodes
  ↓                  ↓
characters ← character_episodes
  ↓
quotes

users → user_favorites → characters
```

### Application Layers

```
Controller Layer (@RestController)
         ↓
Service Layer (@Service)
         ↓
Repository Layer (Spring Data JPA)
         ↓
Database (SQLite)
```

### API Structure

```
/api/shows           - Show management
/api/characters      - Character CRUD (has duplicate Jesse bug)
/api/episodes        - Episode listing (cache bug)
/api/quotes          - Quote management
/auth               - Authentication (⚠️ inconsistent path!)
```

---

## 🐛 Known Issues

This codebase has **36+ intentional bugs** documented in [`BUGS.md`](BUGS.md):

### Critical (3)

- ❌ Duplicate Jesse Pinkman in seed data
- ❌ Episode cache ignores season filter (`@Cacheable` missing key)
- ❌ Inconsistent API paths (`/api/*` vs `/auth`)

### High Priority (10)

- Missing error handling (no try-catch in controllers)
- `Optional.get()` without `isPresent()` check
- Weak password requirements (only 6 chars)
- Security vulnerabilities (CORS wide open, all requests allowed)
- Incomplete JWT authentication (returns "not_implemented")
- Exposed error details in production
- Mixed HTTP status codes (200 vs 201 for POST)

### Medium Priority (10)

- Inconsistent Lombok usage (`@Data` vs `@Getter/@Setter` vs manual)
- Mixed dependency injection (field vs constructor)
- Inconsistent response formats (raw vs wrapped in Map)
- Mixed update methods (PUT vs PATCH)
- No null checks on service methods
- Using Double instead of BigDecimal for rating
- BCryptPasswordEncoder created in controller
- No transaction management (`@Transactional` missing)

### Low Priority (8)

- No pagination on list endpoints
- Verbose logging in production (DEBUG level)
- Deprecated SQL initialization
- No request correlation IDs
- No validation annotations
- No custom exception classes
- No environment-specific configuration

See **[BUGS.md](BUGS.md)** for complete list with code examples.

---

## 🎓 Workshop Learning Path

This application is designed for a progressive workshop teaching AI-assisted Spring Boot development:

### Module 0: The Struggle (30 min)

**Current State**: Try using Copilot now - watch it give confused, generic suggestions

**Experience**:

- Ask "Add a character endpoint" → Gets generic Spring suggestions
- No awareness of Breaking Bad
- Suggests wrong patterns
- Doesn't follow conventions (because there aren't any!)

### Module 1: Repository Instructions (90 min)

**Add**: `.github/copilot-instructions.md` with Spring Boot context

**Transformation**: Ask the same question - now gets Breaking Bad + Spring Boot context!

### Modules 2-7: Progressive Copilot Customization

- **Module 2**: Agent Plan Mode
- **Module 3**: Custom Prompts (Spring-specific templates)
- **Module 4**: Custom Instructions (file-scoped for controllers, services, repositories)
- **Module 5**: Agent Skills (Spring Boot best practices, JPA optimization)
- **Module 6**: MCP Servers (database queries, GitHub integration)
- **Module 7**: Custom Agents - THE PAYOFF (autonomous Spring Boot feature development)

### Modules 8-10: Integration & Deployment

- **Module 8**: GitHub.com integration
- **Module 9**: Copilot CLI
- **Module 10**: Orchestration - Ship the app

---

## 📁 Project Structure

```
java/
├── .github/                    # ❌ MISSING COPILOT CONFIG
│   ├── copilot-instructions.md # ❌ Add in Module 1
│   ├── prompts/                # ❌ Add in Module 3
│   ├── instructions/           # ❌ Add in Module 4
│   ├── skills/                 # ❌ Add in Module 5
│   └── copilot/agents/         # ❌ Add in Module 7
├── .vscode/                    # ❌ MISSING
│   └── mcp.json                # ❌ Add in Module 6
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/fanhub/
│   │   │   │   ├── FanHubApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── SecurityConfig.java      # ⚠️ All requests allowed
│   │   │   │   │   ├── WebConfig.java           # ⚠️ CORS wide open
│   │   │   │   ├── controller/
│   │   │   │   │   ├── CharacterController.java # ⚠️ No error handling
│   │   │   │   │   ├── EpisodeController.java   # 🐛 Cache bug
│   │   │   │   │   ├── ShowController.java
│   │   │   │   │   ├── QuoteController.java
│   │   │   │   │   └── AuthController.java      # ⚠️ Incomplete JWT
│   │   │   │   ├── service/
│   │   │   │   │   ├── CharacterService.java    # 🐛 Optional.get() bug
│   │   │   │   │   ├── EpisodeService.java
│   │   │   │   │   ├── ShowService.java
│   │   │   │   │   └── QuoteService.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── CharacterRepository.java # ⚠️ Missing @Repository
│   │   │   │   │   ├── EpisodeRepository.java
│   │   │   │   │   ├── ShowRepository.java
│   │   │   │   │   ├── QuoteRepository.java
│   │   │   │   │   └── UserRepository.java
│   │   │   │   ├── model/
│   │   │   │   │   ├── Character.java           # Uses @Data
│   │   │   │   │   ├── Episode.java             # Uses @Getter/@Setter
│   │   │   │   │   ├── Show.java                # Manual getters/setters!
│   │   │   │   │   ├── Quote.java
│   │   │   │   │   └── User.java
│   │   │   │   └── dto/                         # ❌ Empty (should have DTOs)
│   │   │   └── resources/
│   │   │       ├── application.properties       # ⚠️ No profiles
│   │   │       ├── schema.sql
│   │   │       └── seed.sql                     # 🐛 Duplicate Jesse!
│   │   └── test/                                # ❌ Empty - no tests
│   ├── pom.xml
│   ├── Dockerfile
│   └── .gitignore
├── frontend/                                    # Copy from node/frontend
│   ├── src/
│   ├── public/
│   ├── package.json                             # Port 3000, proxy to 5265
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── BUGS.md                                      # 👈 36+ Java-specific bugs
├── SETUP.md                                     # 👈 Complete setup guide
├── README.md                                    # 👈 You are here
└── package.json                                 # Root scripts
```

**Legend**:

- ❌ Missing entirely
- ⚠️ Exists but has issues
- 🐛 Contains intentional bugs

---

## 💻 Development

### Available Scripts

```bash
# Root level
npm start              # Start all services with Docker
npm stop               # Stop all services
npm run install:all    # Install all dependencies
npm run backend        # Start backend only (port 5265)
npm run frontend       # Start frontend only (port 3000)
npm run db:reset       # Reset database

# Backend (cd backend/)
./mvnw spring-boot:run # Start with Maven
./mvnw clean install   # Build
./mvnw test            # Run tests (not implemented yet)

# Frontend (cd frontend/)
npm start              # Start development server (port 3000)
npm run build          # Build for production
npm test               # Run tests (not implemented)
```

### Environment Variables

Create `.env` file from `.env.example`:

```bash
# Database (SQLite — file-backed, no separate service required)
DATABASE_URL=jdbc:sqlite:./fanhub.db

# Backend
JWT_SECRET=change_this_in_production
SPRING_PROFILES_ACTIVE=dev

# Frontend
PORT=3000
REACT_APP_API_URL=http://localhost:5265
```

### Database Management

```bash
# Access database shell
docker exec -it fanhub-java-backend sqlite3 /data/fanhub.db

# View characters (should see duplicate Jesse!)
SELECT id, name, actor_name FROM characters;

# Reset database
npm run db:reset
```

---

## 🎯 Workshop TODO List

### Configuration Setup

- [ ] Add `.github/copilot-instructions.md` (Module 1)
- [ ] Create `.github/prompts/` with Spring-specific prompts (Module 3)
- [ ] Add `.github/instructions/` with applyTo patterns (Module 4)
- [ ] Create `.github/skills/` with Spring Boot best practices (Module 5)
- [ ] Configure `.vscode/mcp.json` for database access (Module 6)
- [ ] Build custom agents in `.github/copilot/agents/` (Module 7)

### Bug Fixes

- [ ] Fix duplicate Jesse Pinkman in seed data
- [ ] Fix episode cache to include seasonId in cache key
- [ ] Standardize API paths (move /auth to /api/auth)
- [ ] Add error handling with @ControllerAdvice
- [ ] Fix Optional.get() usage (add isPresent() checks)
- [ ] Implement proper JWT authentication
- [ ] Add @Transactional annotations
- [ ] Standardize response formats

### Code Quality

- [ ] Choose one Lombok approach (@Data everywhere)
- [ ] Use constructor injection everywhere
- [ ] Add @Repository annotations consistently
- [ ] Create DTO layer for API responses
- [ ] Add Bean Validation annotations
- [ ] Create custom exception classes

### Features

- [ ] Complete JWT authentication
- [ ] Add character detail page
- [ ] Add episode detail page
- [ ] Implement search functionality
- [ ] Add admin panel
- [ ] Add API documentation (Swagger/OpenAPI)

### Testing & CI/CD

- [ ] Add unit tests for services
- [ ] Add integration tests for controllers
- [ ] Add repository tests
- [ ] Set up GitHub Actions CI/CD
- [ ] Add code coverage reporting

---

## 📚 Additional Resources

### Related Files

- **[SETUP.md](SETUP.md)** - Complete setup instructions
- **[BUGS.md](BUGS.md)** - Catalog of all 36+ bugs
- **[Root README](../README.md)** - Workshop overview

### External Links

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [CopilotWorkshop Repository](https://github.com/MSBart2/CopilotWorkshop)

---

## 🤔 FAQ

**Q: Why Java/Spring Boot?**
A: To provide a workshop option for Java developers and teams using Spring Boot in production.

**Q: How is this different from the Node.js version?**
A: Same conceptual bugs but implemented with Java-specific anti-patterns (Optional.get(), field injection, inconsistent Lombok usage, etc.)

**Q: Should I fix the bugs first or add Copilot config first?**
A: Add Copilot config first! The workshop shows how proper configuration makes fixing bugs much easier.

**Q: Why Spring Boot 3.2?**
A: Latest stable version with Jakarta EE 10, modern Java features, and Spring Security 6.

**Q: Where are the tests?**
A: You'll write them in the workshop using Copilot's custom prompts!

**Q: Is this production-ready?**
A: Absolutely not! This is a learning project with intentional security issues and bugs.

---

## 📝 Notes

### Java-Specific Anti-Patterns

Unlike typical Spring Boot tutorials with perfect starter code:

- ✅ **Real-world mess**: Inconsistent patterns like actual legacy codebases
- ✅ **Java anti-patterns**: Optional.get(), field injection, Double for money
- ✅ **Spring Boot issues**: Missing @Transactional, no @ControllerAdvice, CORS wide open
- ✅ **36+ bugs**: From critical (duplicate data) to low-priority (verbose logging)
- ✅ **Configuration journey**: See Copilot improve as you add Spring Boot context

### The "Aha!" Moment

Most Java developers experience this in **Module 1** when they:

1. Try Copilot without config → Generic Spring suggestions
2. Add repository instructions with Breaking Bad + Spring Boot context
3. Try the same prompt again → Now gets show-specific, Spring Boot best-practice code!

That's when it clicks: **Context is everything.**

---

**Built with ❤️ (and intentional bugs 🐛) for GitHub Copilot workshops**

_"A contractor started this Spring Boot project but left mid-way. Can you and Copilot turn it into something great?"_
