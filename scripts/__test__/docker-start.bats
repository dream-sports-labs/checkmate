#!/usr/bin/env bats

setup() {
  # Create a temporary directory for mocks
  export MOCK_DIR="$BATS_TMPDIR/bin"
  mkdir -p "$MOCK_DIR"

  # Mock `docker-compose`
  cat << 'EOF' > "$MOCK_DIR/docker-compose"
#!/bin/bash
echo "Mocked docker-compose: $*"
EOF
  chmod +x "$MOCK_DIR/docker-compose"

  # Mock `docker`
  cat << 'EOF' > "$MOCK_DIR/docker"
#!/bin/bash
if [[ "$1" == "inspect" && "$2" == "--format={{json .State.Health.Status}}" ]]; then
  echo '"healthy"'  # Default: return healthy status
else
  echo "Mocked docker: $*"
fi
EOF
  chmod +x "$MOCK_DIR/docker"

  # Save the original PATH and prepend mock directory
  ORIGINAL_PATH="$PATH"
  export PATH="$MOCK_DIR:$PATH"
}

teardown() {
  # Restore the original PATH
  export PATH="$ORIGINAL_PATH"
}

@test "Default behavior should shut down and rebuild DB and skip app" {
  run ./docker-start.sh
  [ "$status" -eq 0 ]
  [[ "$output" == *"Shutting down existing checkmate-db container..."* ]]
  [[ "$output" == *"Starting fresh checkmate-db container..."* ]]
  [[ "$output" == *"Excluding checkmate-app service."* ]]
}

@test "Should fail with invalid --app-docker value" {
  run ./docker-start.sh --app-docker invalid
  [ "$status" -eq 1 ]
  [[ "$output" == *"Invalid value for --app-docker"* ]]
}

@test "Should fail with invalid --db-init value" {
  run ./docker-start.sh --db-init invalid
  [ "$status" -eq 1 ]
  [[ "$output" == *"Invalid value for --db-init"* ]]
}

@test "Should fail with invalid --seed-data value" {
  run ./docker-start.sh --seed-data invalid
  [ "$status" -eq 1 ]
  [[ "$output" == *"Invalid value for --seed-data"* ]]
}

@test "Should rebuild DB if not healthy when --db-init false" {
  # Override docker mock to return unhealthy status
  echo -e '#!/bin/bash\nif [[ "$1" == "inspect" ]]; then echo '"'"'unhealthy'"'"'; else echo "Mocked docker: $*"; fi' > "$MOCK_DIR/docker"
  chmod +x "$MOCK_DIR/docker"

  run ./docker-start.sh --db-init false
  [ "$status" -eq 0 ]
  [[ "$output" == *"Starting or rebuilding checkmate-db..."* ]]
}

@test "Should start checkmate-app when --app-docker true" {
  run ./docker-start.sh --app-docker true
  [ "$status" -eq 0 ]
  [[ "$output" == *"Starting or rebuilding checkmate-app..."* ]]
}

@test "Should skip checkmate-app when --app-docker false" {
  run ./docker-start.sh --app-docker false
  [ "$status" -eq 0 ]
  [[ "$output" == *"Excluding checkmate-app service."* ]]
}

@test "Should not seed data when --seed-data true and --db-init false" {
  run ./docker-start.sh --db-init false --seed-data true
  [ "$status" -eq 0 ]
  [[ "$output" == *"Excluding checkmate-app service."* ]]
}

@test "Should not seed data when --seed-data false and --db-init false" {
  run ./docker-start.sh --db-init false --seed-data false
  [ "$status" -eq 0 ]
  [[ "$output" != *"Starting db_seeder for data seeding as requested..."* ]]
}

@test "Should handle healthy DB and skip unnecessary DB rebuild" {
  run ./docker-start.sh --db-init false
  [ "$status" -eq 0 ]
  [[ "$output" == *"checkmate-db is already running and healthy."* ]]
}

@test "Should handle all flags true" {
  run ./docker-start.sh --app-docker true --db-init true --seed-data true
  [ "$status" -eq 0 ]
  [[ "$output" == *"Starting or rebuilding checkmate-app..."* ]]
  [[ "$output" == *"Starting fresh checkmate-db container..."* ]]
  [[ "$output" == *"Starting db_seeder for data seeding as requested..."* ]]
}

@test "Should handle all flags false" {
  run ./docker-start.sh --app-docker false --db-init false --seed-data false
  [ "$status" -eq 0 ]
  [[ "$output" == *"Excluding checkmate-app service."* ]]
}

@test "Should start DB and app when both flags are true" {
  run ./docker-start.sh --app-docker true --db-init true
  [ "$status" -eq 0 ]
  [[ "$output" == *"Starting or rebuilding checkmate-app..."* ]]
  [[ "$output" == *"Starting fresh checkmate-db container..."* ]]
}

@test "Should only start db_seeder when --seed-data true" {
  run ./docker-start.sh --db-init false --seed-data true
  [ "$status" -eq 0 ]
  [[ "$output" == *"Starting db_seeder for data seeding as requested..."* ]]
  [[ "$output" != *"Shutting down existing checkmate-db container..."* ]]
}