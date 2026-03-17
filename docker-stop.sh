#!/bin/bash

# Docker Compose Stop Script for Eritrea Readiness Project

set -e

echo "🛑 Stopping Eritrea Readiness Project services..."
docker-compose down

echo ""
echo "✅ All services stopped."
echo "📊 Data is preserved in Docker volumes."
echo "💾 To remove all data, run: docker-compose down -v"
echo ""
