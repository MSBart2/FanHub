# FanHub Java/Spring Boot - Setup Guide

> ⚠️ **Workshop Material**: This is an intentionally flawed codebase designed for GitHub Copilot training workshops. Contains 36+ bugs by design.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17 or higher** (JDK)
  ```bash
  java -version  # Should show 17+
  ```
  
- **Maven 3.6+** (included via Maven Wrapper)
  ```bash
  ./mvnw -version
  ```

- **Docker Desktop** (for database and containerized development)
  ```bash
  docker --version
  docker-compose --version
  ```

- **Git** (for version control)

- **Node.js 18+** (for React frontend)

---

## 🚀 Quick Start (Recommended)

### Option 1: Docker Compose (Easiest)

This starts all services (database, backend, frontend) with one command:

```bash
# From the java/ directory
cd java

# Start all services
npm start
# OR
docker-compose up

# Application URLs:
# Frontend: http://localhost:3002
# Backend API: http://localhost:8080
# PostgreSQL: localhost:5434
```

**First time setup:**
```bash
# Copy environment variables
cp .env.example .env

# Start services
docker-compose up
```

### Option 2: Local Development (More Control)

Run services individually without Docker:

```bash
# 1. Start PostgreSQL (using Docker)
docker-compose up -d db

# 2. Start Backend (Spring Boot)
cd backend
./mvnw spring-boot:run
# Backend runs on http://localhost:8080

# 3. In a new terminal, start Frontend (React)
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3002
```

---

## 🏗️ Detailed Setup Instructions

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd FanHub/java
```

### 2. Environment Configuration

Create a `.env` file from the example:

```bash
cp .env.example .env
```

**Environment Variables:**
```bash
# Database
DATABASE_URL=jdbc:postgresql://localhost:5434/fanhub
DB_USERNAME=fanhub
DB_PASSWORD=fanhub_dev_password

# Backend
JWT_SECRET=change_this_in_production
SPRING_PROFILES_ACTIVE=dev

# Frontend
PORT=3002
REACT_APP_API_URL=http://localhost:8080
```

### 3. Install Dependencies

**Backend (Maven):**
```bash
cd backend
./mvnw clean install
```

**Frontend (npm):**
```bash
cd frontend
npm install
```

**Or install both at once:**
```bash
npm run install:all
```

### 4. Database Setup

**Option A: Using Docker Compose**
```bash
# Start only the database
docker-compose up -d db

# Verify database is running
docker ps | grep fanhub-java-db
```

**Option B: Local PostgreSQL**

If you have PostgreSQL installed locally:

```bash
# Create database
createdb -U postgres fanhub

# Run schema
psql -U postgres -d fanhub -f backend/src/main/resources/schema.sql

# Run seed data (includes duplicate Jesse Pinkman bug!)
psql -U postgres -d fanhub -f backend/src/main/resources/seed.sql
```

### 5. Verify Setup

**Check database connection:**
```bash
docker exec -it fanhub-java-db psql -U fanhub -d fanhub -c "SELECT COUNT(*) FROM characters;"
```

**Expected output:** `count: 6` (includes duplicate Jesse!)

**Test backend API:**
```bash
curl http://localhost:8080/api/characters
```

**Test frontend:**
Open http://localhost:3002 in your browser

---

## 🐳 Docker Commands

### Start All Services
```bash
docker-compose up
# Or in detached mode:
docker-compose up -d
```

### Stop All Services
```bash
docker-compose down
# Or with volumes (resets database):
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Rebuild After Code Changes
```bash
# Rebuild backend image
docker-compose build backend

# Rebuild and restart
docker-compose up -d --build
```

### Reset Database
```bash
# Stop and remove volumes
docker-compose down -v

# Start database only (will reinitialize)
docker-compose up -d db

# OR use npm script
npm run db:reset
```

---

## 💻 Development Workflow

### Running Backend Locally

```bash
cd backend

# Run with Maven
./mvnw spring-boot:run

# Run with hot reload (spring-boot-devtools)
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Dagent"

# Build JAR
./mvnw clean package

# Run JAR
java -jar target/fanhub-backend-0.1.0.jar
```

### Running Frontend Locally

```bash
cd frontend

# Development server (port 3002)
npm start

# Build for production
npm run build

# Run tests (not configured yet - intentional)
npm test
```

### Available Scripts

From the `java/` root directory:

```bash
npm start              # Start all services with Docker
npm stop               # Stop all services
npm run backend        # Start backend only (local)
npm run frontend       # Start frontend only (local)
npm run install:all    # Install all dependencies
npm run db:reset       # Reset database
```

---

## 🗄️ Database Management

### Access Database Shell

```bash
docker exec -it fanhub-java-db psql -U fanhub -d fanhub
```

### Useful SQL Queries

```sql
-- View all characters (should see duplicate Jesse!)
SELECT id, name, actor_name FROM characters;

-- Check quotes attribution
SELECT q.id, c.name, q.quote_text 
FROM quotes q 
LEFT JOIN characters c ON q.character_id = c.id;

-- View episodes by season
SELECT season_id, COUNT(*) 
FROM episodes 
GROUP BY season_id;

-- Check database size
SELECT pg_size_pretty(pg_database_size('fanhub'));
```

### Verify Intentional Bugs

**Duplicate Jesse Pinkman:**
```sql
SELECT name, COUNT(*) 
FROM characters 
GROUP BY name 
HAVING COUNT(*) > 1;
```

Expected: `Jesse Pinkman | 2`

---

## 🔧 Troubleshooting

### Backend Won't Start

**Error: "Could not connect to database"**
```bash
# Check if database is running
docker ps | grep fanhub-java-db

# Check database logs
docker-compose logs db

# Verify connection string in application.properties
```

**Error: "Port 8080 already in use"**
```bash
# Find process using port 8080
lsof -i :8080  # Mac/Linux
netstat -ano | findstr :8080  # Windows

# Kill the process or change port in application.properties
server.port=8081
```

**Error: "BUILD FAILURE - dependency resolution"**
```bash
# Clean Maven cache
./mvnw clean

# Force update dependencies
./mvnw clean install -U
```

### Frontend Won't Start

**Error: "Port 3002 already in use"**
```bash
# Change port
PORT=3003 npm start
```

**Error: "Module not found"**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Error: "Proxy error: Could not proxy request"**
```bash
# Ensure backend is running on port 8080
curl http://localhost:8080/api/characters

# Check package.json has correct proxy
"proxy": "http://localhost:8080"
```

### Docker Issues

**Error: "Cannot connect to Docker daemon"**
```bash
# Start Docker Desktop
# Verify Docker is running
docker ps
```

**Error: "Network not found"**
```bash
# Remove all containers and volumes
docker-compose down -v

# Restart
docker-compose up
```

**Database won't initialize**
```bash
# Remove volumes and restart
docker-compose down -v
docker-compose up -d db

# Check logs
docker-compose logs db
```

---

## 🧪 Testing the App

### Verify Bugs Are Present

1. **Duplicate Jesse Pinkman**
   - Visit http://localhost:3002
   - Click "Characters"
   - You should see TWO Jesse Pinkman cards

2. **Cache Bug**
   - Visit http://localhost:3002/episodes
   - Filter by "Season 1"
   - Filter by "Season 2"
   - Filter back to "Season 1"
   - May show wrong episodes due to cache bug

3. **Inconsistent API Paths**
   - Try: `curl http://localhost:8080/api/characters` ✅
   - Try: `curl http://localhost:8080/auth/login` ✅
   - Try: `curl http://localhost:8080/api/auth/login` ❌ (404)

### Test API Endpoints

```bash
# Characters (should show duplicate Jesse)
curl http://localhost:8080/api/characters

# Episodes
curl http://localhost:8080/api/episodes

# Episodes by season (cache bug test)
curl http://localhost:8080/api/episodes?seasonId=1

# Shows
curl http://localhost:8080/api/shows

# Quotes
curl http://localhost:8080/api/quotes

# Register user (weak password validation)
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","username":"test"}'
```

---

## 🎓 Next Steps for Workshop

After getting the app running:

1. **Explore the broken app** - Visit http://localhost:3002 and notice:
   - Two Jesse Pinkman characters (duplicate bug!)
   - Season filter doesn't work properly (cache bug!)
   - Inconsistent API patterns

2. **Review the issues** - Check out the [36+ documented bugs](BUGS.md)

3. **Start the workshop** - Head to the [CopilotWorkshop](https://github.com/MSBart2/CopilotWorkshop) repository for the full training modules

4. **Try Copilot without config** - Ask Copilot to help fix something and see how it struggles without context

5. **Begin Module 1** - Add repository instructions and watch Copilot transform!

---

## 📚 Additional Resources

### IntelliJ IDEA Setup

1. Open the `java/backend` folder as a Maven project
2. Trust the Maven project
3. Ensure JDK 17 is configured: File → Project Structure → Project SDK
4. Enable annotation processing for Lombok: Settings → Build → Compiler → Annotation Processors
5. Install Lombok plugin: Settings → Plugins → search "Lombok"

### VS Code Setup

1. Install extensions:
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - Lombok Annotations Support
2. Open the `java/backend` folder
3. Trust workspace
4. Java runtime will be detected automatically

### Eclipse Setup

1. Install Lombok:
   - Download lombok.jar
   - Run: `java -jar lombok.jar`
   - Select Eclipse installation directory
2. Import as Maven project
3. Update project: Right-click → Maven → Update Project

---

## 🐛 Remember

**These bugs are intentional!** Don't fix them manually yet. The workshop teaches how to systematically address these using AI assistance and Copilot customization.

---

## 📖 Documentation

- [Java/Spring Boot README](README.md) - Architecture and project overview
- [Java BUGS.md](BUGS.md) - Complete catalog of 36+ intentional bugs
- [Root README](../README.md) - Overall workshop information

---

**Ready to start the workshop?** 🚀

This setup gets you running with a messy codebase full of intentional bugs. The real learning begins when you start using GitHub Copilot to transform this code into something production-ready!
