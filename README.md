# Checkmate - Test Case Management Tool

## Overview

Welcome to Checkmate! 🎉

This Test Case Management tool is designed to address the challenges faced by teams in managing and executing test cases with the highest level of availability and reliability. It aims to streamline the testing process, offering robust functionality, seamless integrations, and the ability to handle large-scale operations efficiently.

TechStack Used: Remix, Drizzle, Shadcn, MySQL, Casbin(RBAC)

## Features

- Effortlessly manage test cases and segregate.
- Create runs, track and download reports.
- Integration APIs.
- RBAC & Google Login.

## Installation

### Pre-requisites

1. Docker Desktop
2. Google OAuth Application

### Docker Setup

1. Clone the repository:
   ```sh
   git clone git@github.com:dream-sports-labs/checkmate.git
   ```
2. Create an environment file, based on .env.example.
3. Install dependencies
   ```sh
   yarn install
   ```
4. Set up the application and database:
   ```sh
   yarn docker:setup
   ```
   - Create both the application and database containers using Docker.
   - Seed the database with initial data.
5. App will be started on http://localhost:3000

📌📌 **[Here is the complete setup guide](https://checkmate.dreamsportslabs.com/project/setup/)**

### API Documentation

Postman collection of project APIs is currently on discord, complete documentation is in progress.

## How to Contribute

Checkmate is an open-source project and welcomes contributions from the community. For details on how to contribute, please refer to [CONTRIBUTING.md](/CONTRIBUTING.md).

## Documentation

Check out the full documentation on the [website](https://checkmate.dreamsportslabs.com/).

## Contact

If you need feedback or support, reach out via the [Issue Tracker](https://github.com/dream-sports-labs/checkmate/issues) or [Discord](https://discord.com/channels/1317172052179943504/1329754684730380340).
