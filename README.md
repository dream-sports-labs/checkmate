#### Pre-requisites

1. Docker desktop
2. yarn v4 installed
3. Google OAuth application

#### Local Dev Setup

1. Clone the repo
   ```sh
   git clone git@github.com:dream-sports-labs/checkmate.git
   ```
2. Install dependencies using
   ```sh
   yarn install
   ```
3. Create .env file, take reference from .env.example
4. To setup the checkmate database and seed data
   ```sh
   yarn docker:db:setup
   ```
   It will create the database container in docker, and seed the data in it.
5. To start the application in dev mode
   ```sh
   yarn dev
   ```
6. App will be started on http://localhost:3000

#### Docker Setup

1. Create .env file
2. Install dependencies using
   ```sh
   yarn install
   ```
3. To setup checkmate application and database
   ```sh
   yarn docker:setup
   ```
   - It will create the database and application container in docker
4. App will be started on http://localhost:3000

**Note**: Application running in docker is in **production** mode

#### Developer Scripts

1. To setup the checkmate application in docker with existing database of docker, to visualise the production mode behaviour
   ```sh
   yarn docker:app:setup
   ```
   - This will create the application container in docker, and create the database container only if it is not present
2. Incase of schema changes and you want them reflect on database, run
   ```sh
      yarn dev:db:setup
   ```
   - This will create the database in docker, and instead of seeding data through seed file, it will generate the new schema and store in drizzle folder and push the schema in dataase.
   - Will proceed to run `yarn db:init` and seed the data from app/db/seed folder.
3. To setup the checkmate database
   - To create database only
     ```sh
     yarn docker:db:setup
     ```
   - To insert data in it
     ```sh
     yarn db:init
     ```
4. Run the [drizzle](https://orm.drizzle.team/docs/overview) studio to monitor your database
   ```sh
   yarn db:studio
   ```
5. Generate sql file from the drizzle schema
   ```sh
   yarn db:generate
   ```
   - This will generate sql file in drizzle folder at root
