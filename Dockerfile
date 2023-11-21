# Use an official Node.js runtime as a parent image
FROM node:14 as builder

# Set the working directory
WORKDIR /Mjölnir

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

ARG VITE_THYRA_API_URL

ENV VITE_THYRA_API_URL=$VITE_THYRA_API_URL

# Build the app
RUN npm run build

# No need for a second stage here since we're using shared volumes
