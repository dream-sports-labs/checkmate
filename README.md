# Checkmate - Test Case Management Tool

## Overview

## Features

- Test Management
- Create, manage and track test runs.
- Integration APIs
- Reporting & Analytics
- RBAC & Google Login

## Usage

### Pre-requisites

1. Docker Desktop
2. Google OAuth Application

### Installation: Docker Setup

1. Create an environment file:
   - Ensure you have a .env file in place, based on .env.example.
2. Install dependencies
   ```sh frame="none"
   yarn install
   ```
3. Set up the application and database:
   ```sh frame="none"
   yarn docker:setup
   ```
   - Create both the application and database containers using Docker.
   - Seed the database with initial data.
4. App will be started on http://localhost:3000

📌📌 **[Here](https://checkmate.dreamsportslabs.com/project/setup/) is the complete setup guide.**

### API Documentation

Postman collection of project APIs is currently on discord, complete documentation is in progress.

## How to Contribute

Checkmate is an open-source project and welcomes contributions from the community. For details on how to contribute, please refer to [CONTRIBUTING.md](/CONTRIBUTING.md).

## Documentation

Check out the full documentation on the [website](https://checkmate.dreamsportslabs.com/).

## Contact

If you need feedback or support, reach out via the [Issue Tracker](https://github.com/dream-sports-labs/checkmate/issues) or [Discord](https://discord.com/channels/1317172052179943504/1329754684730380340).
