### Pre-requisites

1. **Docker Desktop**: Ensure Docker Desktop is installed and running.
2. **Yarn v4**
3. **Google OAuth Application**: Set up a Google OAuth application to use authentication features.

### Local Dev Setup

1. Clone the repository:
   ```sh
   git clone git@github.com:dream-sports-labs/checkmate.git
   ```
2. Install dependencies
   ```sh
   yarn install
   ```
3. Create .env file,
   - Copy the .env.example file and rename it to .env. Update it with your specific environment variables.
4. Set up the database and seed data:
   ```sh
   yarn docker:db:setup
   ```
   This command will:
   - Create a database container using Docker.
   - Seed the database with initial data.
5. Start the application in development mode:
   ```sh
   yarn dev
   ```
6. App will be started on http://localhost:3000

### Docker Setup

1. Create an environment file:
   - Ensure you have a .env file in place, based on .env.example.
2. Install dependencies
   ```sh
   yarn install
   ```
3. Set up the application and database:
   ```sh
   yarn docker:setup
   ```
   This command will:
   - Create both the application and database containers using Docker.
   - Seed the database with initial data.
4. App will be started on http://localhost:3000

**Note**: Application running in docker is in **production** mode

### Developer Scripts

1. Set up the application in Docker with an existing database:
   ```sh
   yarn docker:app:setup
   ```
   - Use this script to replicate production-like behavior in Docker while reusing an existing database container.
   - If a database container does not already exist, this script will create one.
2. IApply schema changes to the database:
   ```sh
      yarn dev:db:setup
   ```
   This command will:
   - Create a database container in Docker (if one doesn’t exist).
   - Generate the updated schema in the drizzle folder.
   - Apply the schema to the database.
   - Seed data from the app/db/seed folder.
3. Manage the Checkmate database:
   - Create the database:
     ```sh
     yarn docker:db:setup
     ```
   - Insert seed data from seed folder:
     ```sh
     yarn db:init
     ```
4. Monitor the database with [Drizzle Studio](https://orm.drizzle.team/docs/overview):
   - Use the Drizzle Studio tool to explore and manage the database.
   ```sh
   yarn db:studio
   ```
5. Generate SQL from the Drizzle schema:
   - To export the database schema as an SQL file:
   ```sh
   yarn db:generate
   ```
   - The generated SQL file will be saved in the drizzle folder at the project root.
