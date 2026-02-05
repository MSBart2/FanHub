FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /app

# Copy maven wrapper and pom.xml
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build application
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# INTENTIONAL BUG: Running as root user (security issue)
# INTENTIONAL BUG: Using dev profile in Dockerfile
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
