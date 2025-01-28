#!/bin/bash

# Database connection details
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD=$MYSQL_ROOT_PASSWORD
DB_NAME=$MYSQL_DATABASE

is_table_empty() {
  local table_name=$1
  local row_count=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -D "$DB_NAME" -se "SELECT COUNT(*) FROM $table_name;" 2>/dev/null)
  if [[ "$row_count" -eq 0 ]]; then
    return 0
  else
    return 1
  fi
}

# Run migrations and injections conditionally
if is_table_empty "sections"; then
  echo "Seeding sections..."
  yarn tsx './app/db/seed/seedTests/sections/sectionMigration.ts'
  yarn tsx './app/db/seed/seedTests/sections/dbInjection.ts'
else
  echo "Sections table already seeded. Skipping..."
fi

if is_table_empty "squads"; then
  echo "Seeding squads..."
  yarn tsx './app/db/seed/seedTests/squad/squadsMigration.ts'
  yarn tsx './app/db/seed/seedTests/squad/dbInjection.ts'
else
  echo "Squads table already seeded. Skipping..."
fi

if is_table_empty "tests"; then
  echo "Seeding tests..."
  yarn tsx './app/db/seed/seedTests/tests/testsMigration.ts'
  yarn tsx './app/db/seed/seedTests/tests/dbInjection.ts'
else
  echo "Tests table already seeded. Skipping..."
fi
