# Stage 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app
COPY . .

# Install dependencies and build
RUN npm ci
RUN npm run build

# Stage 2: Serve with 'serve'
FROM node:20-alpine

# Install 'serve' globally
RUN npm install -g serve

WORKDIR /app

# Copy the built React app from the previous stage
COPY --from=build /app/build/client /app/client

# Expose the port used by 'serve'
EXPOSE 3000

# Serve the client build folder as an SPA
CMD ["serve", "-s", "client", "-l", "3000"]
