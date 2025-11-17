#!/bin/bash

echo "🚀 Setting up the Thundering Herd prototype..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check for docker compose command
DOCKER_COMPOSE_CMD=""
if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
    echo "✅ Using modern 'docker compose' command"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
    echo "✅ Using legacy 'docker-compose' command"
else
    echo "❌ Neither 'docker compose' nor 'docker-compose' is available. Please install Docker first."
    exit 1
fi

# Clean up old migration history to allow provider switch
echo "🧹 Cleaning up old migration history..."
rm -rf ./nestjs/prisma/migrations
rm -rf ./nestjs/generated 

echo "📦 Building and starting services... (This may take a moment)"
$DOCKER_COMPOSE_CMD down -v
if ! $DOCKER_COMPOSE_CMD up -d --build; then
    echo "❌ Docker build failed. Please check the error messages above."
    exit 1
fi

echo "⏳ Waiting for services to be healthy..."
# We add a small delay to ensure services are fully initialized internally
sleep 10 

echo "🔄 Applying database migrations..."
if ! $DOCKER_COMPOSE_CMD exec -T nestjs npx prisma migrate dev --name init; then
    echo "❌ Database migration failed. Please check the logs."
    $DOCKER_COMPOSE_CMD logs nestjs
    exit 1
fi

# --- THE NEW STEP: SEEDING THE DATABASE ---
echo "🌱 Seeding the database with initial data..."
if ! $DOCKER_COMPOSE_CMD exec -T nestjs npx prisma db seed; then
    echo "❌ Database seeding failed. Please check the logs."
    $DOCKER_COMPOSE_CMD logs nestjs
    exit 1
fi

echo "✅ Setup complete! System is ready for load testing."
echo ""
echo "🌐 Access points:"
echo "   NestJS API: http://localhost:8080"
echo "   Jaeger UI:  http://localhost:16686"
echo ""
echo "🧪 To run a load test (e.g., 100 virtual users for 1 minute):"
echo "   k6 run --vus 100 --duration 1m load-testing/load-test.js"
echo ""
echo "📊 To view logs:"
echo "   $DOCKER_COMPOSE_CMD logs -f"
echo ""
echo "🛑 To stop all services:"
echo "   $DOCKER_COMPOSE_CMD down"