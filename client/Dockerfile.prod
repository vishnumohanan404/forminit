# Use an official Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Expose the port the app will run on
EXPOSE 5173

# Start the React app in development mode
CMD ["npm", "run", "dev-exposed"]
