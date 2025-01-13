#!/bin/bash

echo "Would you like to seed tests data? (y/n)"
read answer
answer=$(echo "$answer" | tr '[:upper:]' '[:lower:]')
if [ "$answer" == "y" ]; then
    echo "Proceeding further..."
    yarn tsx './app/db/seed/seedTests/sections/sectionMigration.ts'
    yarn tsx './app/db/seed/seedTests/sections/dbInjection.ts'
    yarn tsx './app/db/seed/seedTests/squad/squadsMigration.ts'
    yarn tsx './app/db/seed/seedTests/squad/dbInjection.ts'
    yarn tsx './app/db/seed/seedTests/tests/testsMigration.ts'
    yarn tsx './app/db/seed/seedTests/tests/dbInjection.ts'
else
    echo "Exiting."
    exit 0
fi
