# backend/Dockerfile
FROM openjdk:17-jdk-slim AS builder

# docker directory
WORKDIR /app

# copy maven packages
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# run file permissions of the maven
RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline -B

# copy source code and build the application
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

# expose port
EXPOSE 8080

# run command
CMD ["java", "-jar", "app.jar"]