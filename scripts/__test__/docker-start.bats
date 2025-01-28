#!/usr/bin/env bats

setup() {
  # Mock commands
  function docker-compose() {
    echo "Mocked docker-compose: $*"
  }

  function docker() {
    if [[ "$1" == "inspect" ]]; then
      echo '"healthy"'  # Mocked exact output expected by the script
    else
      echo "Mocked docker: $*"
    fi
  }

  # Save the original PATH
  ORIGINAL_PATH=$PATH

  # Override PATH to include mocked commands
  PATH=$BATS_TMPDIR:$PATH
}

teardown() {
  # Restore the original PATH
  PATH=$ORIGINAL_PATH
}

@test "Default behavior should shut down and rebuild DB and skip app" {
  run ./docker-start.sh
  [[ "$status" -eq 0 ]]
  [[ "$output" == *"Shutting down existing checkmate-db container..."* ]]
  [[ "$output" == *"Starting fresh checkmate-db container..."* ]]
  [[ "$output" == *"Excluding checkmate-app service."* ]]
}

@test "Should fail with invalid --app-docker value" {
  run ./docker-start.sh --app-docker invalid
  [[ "$status" -eq 1 ]]
  [[ "$output" == *"Invalid value for --app-docker"* ]]
}

@test "Should fail with invalid --db-init value" {
  run ./docker-start.sh --db-init invalid
  [[ "$status" -eq 1 ]]
  [[ "$output" == *"Invalid value for --db-init"* ]]
}

@test "Should fail with invalid --seed-data value" {
  run ./docker-start.sh --seed-data invalid
  [[ "$status" -eq 1 ]]
  [[ "$output" == *"Invalid value for --seed-data"* ]]
}

@test "Should rebuild DB if not healthy when --db-init false" {
  function docker() {
    if [[ "$1" == "inspect" ]]; then
      echo '{"State":{"Health":{"Status":"unhealthy"}}}'  # Mocked unhealthy status
    else
      echo "Mocked docker: $*"
    fi
  }

  run ./docker-start.sh --db-init false
  [[ "$status" -eq 0 ]]
  [[ "$output" == *"Starting or rebuilding checkmate-db..."* ]]
}

@test "Should start checkmate-app when --app-docker true" {
  run ./docker-start.sh --app-docker true
  [[ "$status" -eq 0 ]]
  [[ "$output" == *"Starting or rebuilding checkmate-app..."* ]]
}

@test "Should skip checkmate-app when --app-docker false" {
  run ./docker-start.sh --app-docker false
  [[ "$status" -eq 0 ]]
  [[ "$output" == *"Excluding checkmate-app service."* ]]
}

@test "Should seed data when --seed-data true and --db-init false" {
  run ./docker-start.sh --db-init false --seed-data true
  [[ "$status" -eq 0 ]]
  [[ "$output" == *"Starting db_seeder for data seeding as requested..."* ]]
}

@test "Should not seed data when --seed-data false and --db-init false" {
  run ./docker-start.sh --db-init false --seed-data false
  [[ "$status" -eq 0 ]]
  [[ "$output" != *"Starting db_seeder for data seeding as requested..."* ]]
}

@test "Should always seed data when --db-init true" {
  run ./docker-start.sh --db-init true --seed-data false
  [[ "$status" -eq 0 ]]
  [[ "$output" == *"Starting fresh checkmate-db container..."* ]]
  [[ "$output" == *"Starting db_seeder for fresh data seeding..."* ]]
}

@test "Should handle healthy DB and skip unnecessary DB rebuild" {
  function docker() {
    if [[ "$1" == "inspect" ]]; then
      echo '{"State":{"Health":{"Status":"healthy"}}}'  # Mocked healthy status
    else
      echo "Mocked docker: $*"
    fi
  }

  run ./docker-start.sh --db-init false
  [[ "$status" -eq 0 ]]
  [[ "$output" == *"checkmate-db is already running and healthy."* ]]
}