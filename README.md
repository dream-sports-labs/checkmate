# Checkmate - Test Case Management Tool

## Overview

## Features

- Light/dark mode toggle
- Live previews
- Fullscreen mode
- Cross platform

## Usage

### Docker Setup

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

📌 **[Here](https://checkmate.dreamsportslabs.com/project/setup/) is the complete setup guide.** 🚀

## How to Contribute

Checkmate is an open-source project and welcomes contributions from the community. For details on how to contribute, please refer to [CONTRIBUTING.md](/CONTRIBUTING.md).

### Documentation

Check out the full documentation on the [website](https://checkmate.dreamsportslabs.com/).
