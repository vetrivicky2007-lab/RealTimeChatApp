# =============================================================
# UniHive Single-Service Dockerfile (Root Build Context)
# =============================================================
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom and source from root
COPY pom.xml .
COPY src ./src

# Build production executable jar containing embedded static frontend
RUN mvn clean package -DskipTests

# Runtime image
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
