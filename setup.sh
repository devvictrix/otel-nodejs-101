#!/bin/bash

echo "🚀 Setting up Node.js Demo with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check for docker compose (modern) or docker-compose (legacy)
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

echo "📦 Building and starting services..."
$DOCKER_COMPOSE_CMD up -d --build

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "🤖 Pulling llama3.2 model..."
$DOCKER_COMPOSE_CMD exec -T ollama ollama pull llama3.2

echo "✅ Setup complete!"
echo ""
echo "🌐 Access points:"
echo "   Express: http://localhost:8080"
echo "   NestJS: http://localhost:8081"
echo "   Jaeger UI: http://localhost:16686"
echo "   Ollama API: http://localhost:11434"
echo ""
echo "🧪 Test the services:"
echo "   curl http://localhost:8080"
echo ""
echo "📊 View logs:"
echo "   $DOCKER_COMPOSE_CMD logs -f"
echo ""
echo "🛑 Stop services:"
echo "   $DOCKER_COMPOSE_CMD down"