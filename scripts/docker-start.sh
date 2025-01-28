#!/bin/bash


APP_DOCKER=false
DB_INIT=true


while [[ "$#" -gt 0 ]]; do
  case $1 in
    --app-docker) APP_DOCKER="$2"; shift ;;   
    --db-init) DB_INIT="$2"; shift ;;         
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--app-docker <true|false>] [--db-init <true|false>]"
      exit 1
      ;;
  esac
  shift
done


if [[ "$APP_DOCKER" != "true" && "$APP_DOCKER" != "false" ]]; then
  echo "Invalid value for --app-docker. Use 'true' or 'false'."
  exit 1
fi

if [[ "$DB_INIT" != "true" && "$DB_INIT" != "false" ]]; then
  echo "Invalid value for --db-init. Use 'true' or 'false'."
  exit 1
fi
docker-compose down --volumes checkmate-app

if [ "$DB_INIT" == "true" ]; then
  echo "Shutting down existing checkmate-db container..."
  docker-compose down --volumes checkmate-db
  docker-compose down --volumes db_seeder
  echo "Starting fresh checkmate-db container..."
  docker-compose up --build -d checkmate-db
  docker-compose up --build -d db_seeder
  sleep 10
else
  DB_STATUS=$(docker inspect --format='{{json .State.Health.Status}}' checkmate-db 2>/dev/null)
  if [ "$DB_STATUS" == '"healthy"' ]; then
    echo "checkmate-db is already running and healthy."
  else
    echo "Starting or rebuilding checkmate-db..."
    docker-compose up --build -d checkmate-db
    docker-compose up --build -d db_seeder
    sleep 10
  fi
fi


if [ "$APP_DOCKER" == "true" ]; then
  echo "Starting or rebuilding checkmate-app..."
  docker-compose up --build -d checkmate-app
else
  echo "Excluding checkmate-app service."
fi