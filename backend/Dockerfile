# ======= BUILD STAGE =======
FROM gradle:8.8-jdk21 AS build

WORKDIR /app

# --- Accept build-time environment flag ---
ARG ENVIRONMENT=dev
ENV ENVIRONMENT=$ENVIRONMENT

COPY . .

# Remove any accidental .env already in repo
RUN rm -f .env

# Copy correct env file based on ENVIRONMENT arg
RUN if [ "$ENVIRONMENT" = "prod" ]; then \
      cp .env.prod .env; \
    else \
      cp .env.dev .env; \
    fi


RUN ./gradlew shadowJar --no-daemon


# ======= RUNTIME STAGE =======
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

COPY --from=build /app/build/libs/pricedropproject-1.0-all.jar app.jar
COPY --from=build /app/.env .env

CMD ["java", "-jar", "app.jar"]
