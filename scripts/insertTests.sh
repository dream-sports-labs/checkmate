#!/bin/bash

yarn tsx './app/db/seed/seedTests/sections/sectionMigration.ts'
yarn tsx './app/db/seed/seedTests/sections/dbInjection.ts'
yarn tsx './app/db/seed/seedTests/squad/squadsMigration.ts'
yarn tsx './app/db/seed/seedTests/squad/dbInjection.ts'
yarn tsx './app/db/seed/seedTests/tests/testsMigration.ts'
yarn tsx './app/db/seed/seedTests/tests/dbInjection.ts'
