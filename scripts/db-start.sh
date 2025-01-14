#!/bin/bash

# Default values for flags
APP_DOCKER=true
DB_INIT=false

# Parse named arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --app-docker) APP_DOCKER="$2"; shift ;;   # Flag to control checkmate-app initialization
    --db-init) DB_INIT="$2"; shift ;;         # Flag to control checkmate-db restart
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--app-docker <true|false>] [--db-init <true|false>]"
      exit 1
      ;;
  esac
  shift
done

# Validate arguments
if [[ "$APP_DOCKER" != "true" && "$APP_DOCKER" != "false" ]]; then
  echo "Invalid value for --app-docker. Use 'true' or 'false'."
  exit 1
fi

if [[ "$DB_INIT" != "true" && "$DB_INIT" != "false" ]]; then
  echo "Invalid value for --db-init. Use 'true' or 'false'."
  exit 1
fi

# Handle checkmate-db container
if [ "$DB_INIT" == "true" ]; then
  echo "Shutting down existing checkmate-db container..."
  docker-compose down --volumes checkmate-db
  echo "Starting fresh checkmate-db container..."
  docker-compose up --build -d checkmate-db
  # Allow time for the database to initialize
  sleep 10
else
  DB_STATUS=$(docker inspect --format='{{json .State.Health.Status}}' checkmate-db 2>/dev/null)
  if [ "$DB_STATUS" == '"healthy"' ]; then
    echo "checkmate-db is already running and healthy."
  else
    echo "Starting or rebuilding checkmate-db..."
    docker-compose up --build -d checkmate-db
    sleep 10
  fi
fi

# Handle checkmate-app container
if [ "$APP_DOCKER" == "true" ]; then
  echo "Starting or rebuilding checkmate-app..."
  docker-compose up --build -d checkmate-app
else
  echo "Excluding checkmate-app service."
fi