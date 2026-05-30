FROM maven:3.9.9-eclipse-temurin-21

WORKDIR /app

COPY . .

RUN mvn clean package

CMD ["mvn", "exec:java", "-Dexec.mainClass=chat.ChatWebSocketServer"]