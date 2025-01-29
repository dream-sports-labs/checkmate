#!/bin/bash

APP_DOCKER=false
DB_INIT=true
SEED_DATA=false

while [[ "$#" -gt 0 ]]; do
  case $1 in
    --app-docker) APP_DOCKER="$2"; shift ;;    # Flag for running the app in Docker
    --db-init) DB_INIT="$2"; shift ;;          # Flag for initializing the database
    --seed-data) SEED_DATA="$2"; shift ;;      # Flag for triggering db_seeder
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--app-docker <true|false>] [--db-init <true|false>] [--seed-data <true|false>]"
      exit 1
      ;;
  esac
  shift
done

# Validate flags
if [[ "$APP_DOCKER" != "true" && "$APP_DOCKER" != "false" ]]; then
  echo "Invalid value for --app-docker. Use 'true' or 'false'."
  exit 1
fi

if [[ "$DB_INIT" != "true" && "$DB_INIT" != "false" ]]; then
  echo "Invalid value for --db-init. Use 'true' or 'false'."
  exit 1
fi

if [[ "$SEED_DATA" != "true" && "$SEED_DATA" != "false" ]]; then
  echo "Invalid value for --seed-data. Use 'true' or 'false'."
  exit 1
fi


echo $APP_DOCKER $DB_INIT $SEED_DATA

if [ "$DB_INIT" == "true" ]; then
  echo "Shutting down existing checkmate-db container..."
  docker-compose down --volumes checkmate-db
  echo "Starting fresh checkmate-db container..."
  docker-compose up --build -d checkmate-db
else
  DB_STATUS=$(docker inspect --format='{{json .State.Health.Status}}' checkmate-db 2>/dev/null)
  if [ "$DB_STATUS" == '"healthy"' ]; then
    echo "checkmate-db is already running and healthy."
  else
    echo "Starting or rebuilding checkmate-db..."
    docker-compose up --build -d checkmate-db
    sleep 10
  fi
  
  # Conditionally trigger db_seeder if --seed-data is true
  if [ "$SEED_DATA" == "true" ]; then
    echo "Starting db_seeder for data seeding as requested..."
    docker-compose down --volumes db_seeder
    docker-compose up --build -d db_seeder
  fi
fi

if [ "$APP_DOCKER" == "true" ]; then
  docker-compose down --volumes checkmate-app
  echo "Starting or rebuilding checkmate-app..."
  docker-compose up --build -d checkmate-app
else
  echo "Excluding checkmate-app service."
fi