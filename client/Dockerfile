FROM node:24.2.0-slim

# Set the working directory inside the container
WORKDIR /app

# Copy root package.json and package-lock.json files
COPY package*.json ./

# Copy workspace definitions needed for installing shared packages
COPY client/package*.json ./client/
COPY packages/types/package*.json ./packages/types/

# Copy source code of shared package to make it installable
COPY packages/types ./packages/types

# Disable husky prepare as not required for docker
ENV HUSKY=0

# Install dependencies
RUN npm install --workspace=client 

# Copy the rest of the app's source code
COPY ./client ./client

# Expose the port the app will run on
EXPOSE 5173

# Start the React app in development mode
CMD ["npm", "run", "dev-exposed", "--workspace=client"]
