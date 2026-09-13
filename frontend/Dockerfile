# Stage 1: Build static React application
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy package descriptors and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build production assets
COPY . .
RUN npm run build

# Stage 2: Serve static files with NGINX
FROM nginx:alpine AS production-stage

# Copy Nginx custom configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production build artifacts from build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
