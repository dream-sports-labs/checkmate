# Use Node.js base image
FROM node:18

RUN mkdir -p /home/node/checkmate/node_modules

RUN chmod +x /home/node/checkmate/* 

# Set working directory
WORKDIR /home/node/checkmate

# Copy only essential files
COPY package.json yarn.lock ./

# Enable Corepack and install Yarn 4.0.0
RUN corepack enable && corepack prepare yarn@4.0.0 --activate

# # Copy remaining application files
COPY . .

# # Install dependencies
RUN yarn install
RUN echo "DB seeding started"
RUN yarn db:init

# # Add build dependencies for esbuild
# RUN apt-get update && apt-get install -y build-essential

# # Expose application port
EXPOSE 3000

# # Start the application
CMD ["yarn", "dev"]
