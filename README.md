# Welcome to Checkmate

## Pre-requisites

1. Docker desktop
2. yarn v4 installed

## Setup

1. Create .env file
2. To setup the checkmate database

```sh
yarn dev:db:setup
```

It will create the database container in docker.

- Connect with mysql instance from docker
- Create database checkmate by ` create database checkmate`
- `yarn run db:push` to push the schema to your database
- `yarn run db:seed` to push the seed data into your database

## Development

Run the Vite dev server:

```shellscript
yarn dev
```

Run the drizzle studio to see your database

```sh
yarn db:studio
```

Create sql file for the database

```sh
yarn db:generate
```

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
