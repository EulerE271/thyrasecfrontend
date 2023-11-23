# Use an official Node.js runtime as a parent image
FROM node:14 as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Use Nginx to serve the static files
FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf

# Copy built files from the builder stage to Nginx's serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80
