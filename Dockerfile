# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy all source code to the working directory
COPY . .

# Make port 5173 available to the world outside this container
EXPOSE 5173

# Define the command to run your application
CMD [ "npm", "run", "dev" ]
