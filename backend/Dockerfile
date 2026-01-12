FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json .*

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p docs uploads news-imgs

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
