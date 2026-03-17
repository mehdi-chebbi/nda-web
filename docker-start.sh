#!/bin/bash

# Docker Compose Startup Script for Eritrea Readiness Project

set -e

echo "🚀 Starting Eritrea Readiness Project with Docker..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created."
    echo "⚠️  IMPORTANT: Please edit .env and change JWT_SECRET to a secure value!"
    echo ""
    read -p "Press Enter to continue after editing .env..."
fi

# Build and start services
echo "📦 Building and starting services..."
docker-compose up -d --build

echo ""
echo "✅ Services started successfully!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend:  http://localhost"
echo "   Backend:   http://localhost:3000"
echo "   Database:  localhost:5432"
echo ""
echo "📋 View logs with: docker-compose logs -f"
echo "🛑 Stop services with: docker-compose down"
echo ""
