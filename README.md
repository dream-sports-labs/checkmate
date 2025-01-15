# Welcome to Checkmate

## Pre-requisites

1. Docker desktop
2. yarn v4 installed

## Local Dev Setup

1. Create .env file
2. To setup the checkmate database and seed data

```sh
yarn dev:setup
```
3. To start the application in dev mode
```sh 
yarn dev
```
4. App will be started on http://localhost:3000

It will create the database container in docker.


## Docker Setup
1. Create .env file 
2. To setup checkmate application and database 
```sh
yarn docker:setup
```

- It will create the database and application container in docker

3. To setup the checkmate application
```sh
yarn docker:app:setup
```

- It will create the application container in docker
- It will create the database container only if it is not present


4. To setup the checkmate database
```sh
yarn docker:db:setup
```
- It will create the database container in docker


## Development

Run the drizzle studio to monitor your database

```sh
yarn db:studio
```

Create sql file for the database

```sh
yarn db:generate
```
- It will generate sql file in drizzle folder at root

## Deployment

First, build your app for production:

```sh
yarn build
```

Then run the app in production mode:

```sh
yarn start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `yarn run build`

- `build/server`
- `build/client`
