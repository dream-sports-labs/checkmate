# Base image for Node.js 20.17.0 
FROM node:20.17.0

# Set working directory
WORKDIR /app

# Install required system dependencies for building native modules
RUN apt-get update && apt-get install -y python3 build-essential

# Copy package manager configuration files
COPY package.json yarn.lock ./

# Reinstall dependencies and handle optional dependencies
RUN corepack enable && corepack prepare yarn@4.0.0 --activate

# Copy application code
COPY . .
RUN yarn install

# RUN yarn db:init
# # Build the Remix application
RUN yarn build

# # Expose the Remix application's default port
EXPOSE 3000

# # Set the default command to start the application
CMD ["yarn", "start"]