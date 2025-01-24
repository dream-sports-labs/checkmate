#### Pre-requisites

1. Docker desktop
2. yarn v4 installed

#### Local Dev Setup

1. Clone the repo
   ```sh frame="none"
   git clone git@github.com:dream-sports-labs/checkmate.git
   ```
2. Install dependencies using
   ```sh frame="none"
   yarn install
   ```
3. Create .env file, take reference from .env.example
4. To setup the checkmate database and seed data
   ```sh frame="none"
   yarn dev:setup
   ```
   It will create the database container in docker, and seed the data in it.
5. To start the application in dev mode
   ```sh frame="none"
   yarn dev
   ```
6. App will be started on http://localhost:3000

#### Docker Setup

1. Create .env file
2. Install dependencies using
   ```sh frame="none"
   yarn install
   ```
3. To setup checkmate application and database
   ```sh frame="none"
   yarn docker:setup
   ```
   - It will create the database and application container in docker
4. App will be started on http://localhost:3000

**Note**: Application running in docker is in **production** mode

#### Developer Scripts

1. To setup the checkmate application in docker with existing database of docker, to visualise the production mode behaviour
   ```sh frame="none"
   yarn docker:app:setup
   ```
   - This will create the application container in docker, and create the database container only if it is not present
2. To setup the checkmate database
   - To create database only
     ```sh frame="none"
     yarn docker:db:setup
     ```
   - To insert data in it
     ```sh frame="none"
     yarn db:init
     ```
3. Run the [drizzle](https://orm.drizzle.team/docs/overview) studio to monitor your database
   ```sh frame="none"
   yarn db:studio
   ```
4. Generate sql file from the drizzle schema
   ```sh frame="none"
   yarn db:generate
   ```
   - This will generate sql file in drizzle folder at root
