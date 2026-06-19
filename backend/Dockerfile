FROM node:18

WORKDIR /app

# Install dependencies including poppler-utils for PDF thumbnail generation
RUN apt-get update && apt-get install -y \
    poppler-utils \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev
# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p docs uploads news-imgs thumbnails

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start application
CMD ["node", "server.js"]
