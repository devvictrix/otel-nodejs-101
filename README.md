# Node.js Demo with Docker and OpenTelemetry

This project demonstrates microservices architecture with Express and NestJS services, Ollama LLM integration, and OpenTelemetry tracing with Jaeger visualization.

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Express    │────│   NestJS    │    │   Ollama    │
│ (Port 8080) │    │ (Port 8081) │    │ (Port 11434)│
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                  ┌─────────────┐
                  │   Jaeger    │
                  │ (Port 16686)│
                  └─────────────┘
```

## Services

- **express**: Main service that calls NestJS and Ollama
- **nestjs**: Secondary service built with NestJS framework
- **ollama**: LLM service (llama3.2 model)
- **jaeger**: Distributed trace visualization tool

## Quick Start

1. **Start all services:**
   ```bash
   ./setup.sh
   ```
   Or manually:
   ```bash
   docker compose up -d
   ```

2. **Pull the llama3.2 model:**
   ```bash
   docker compose exec ollama ollama pull llama3.2
   ```

3. **Test the services:**
   ```bash
   # Test express (calls nestjs and Ollama)
   curl http://localhost:8080
   
   # Test nestjs endpoints
   curl http://localhost:8081
   curl http://localhost:8081/health
   curl http://localhost:8081/users/123
   curl http://localhost:8081/slow
   ```

## Access Points

- **Express**: http://localhost:8080
- **NestJS**: http://localhost:8081
- **Jaeger UI**: http://localhost:16686
- **Ollama API**: http://localhost:11434

## Available Endpoints

### Express Service (Port 8080)
- `GET /` - Main endpoint that calls NestJS and Ollama

### NestJS Service (Port 8081)
- `GET /` - Basic hello message
- `GET /health` - Health check endpoint
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `GET /slow` - Slow endpoint for tracing demonstration

## OpenTelemetry Configuration

### Environment Variables

- `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT`: Jaeger OTLP endpoint for traces
- `OTEL_SERVICE_NAME`: Service name for tracing identification
- `NESTJS_SERVICE_URL`: NestJS service URL for Express to call
- `OLLAMA_URL`: Ollama service URL

### Instrumentation Setup

Both services use OpenTelemetry with automatic instrumentation:

1. **Express Service**: Uses `instrumentation.ts` with automatic node instrumentation
2. **NestJS Service**: Uses `src/instrumentation.ts` with the same configuration

The instrumentation files are imported first in the application entry points to ensure proper module patching.

### Tracing Features

- Automatic HTTP request/response tracing
- Service-to-service communication tracing
- Custom span attributes and events
- Distributed context propagation
- Error handling and exception tracing

## Development

### Local Development

```bash
# Start services individually
cd express && npm run dev
cd nestjs && npm run dev
ollama serve
```

### View Logs

```bash
# View all service logs
docker compose logs -f

# View specific service logs
docker compose logs -f express
docker compose logs -f nestjs
docker compose logs -f ollama
docker compose logs -f jaeger
```

### Stop Services

```bash
# Stop and remove containers
docker compose down

# Stop and remove with volumes
docker compose down -v
```

## Configuration

### Docker Compose Services

- **express**: Runs on port 8080, uses volume mounts for development
- **nestjs**: Runs on port 8081 (external), 3000 (internal), uses multi-stage build
- **jaeger**: All-in-one Jaeger with OTLP collector enabled
- **ollama**: LLM service with persistent data volume

### Network Configuration

All services communicate through a shared Docker network (`app-network`) using service names as hostnames.

## Troubleshooting

### Common Issues

1. **Ollama model not found:**
   ```bash
   docker-compose exec ollama ollama pull llama3.2
   ```

2. **Services can't communicate:**
   - Check if all services are running: `docker compose ps`
   - Verify network connectivity: `docker compose exec express ping nestjs`
   - Check port configurations in docker-compose.yml

3. **No traces in Jaeger:**
   - Check if Jaeger is running: `docker compose ps jaeger`
   - Verify OTLP endpoint configuration in environment variables
   - Check service logs: `docker compose logs express nestjs`
   - Ensure `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` is set correctly

4. **NestJS build issues:**
   - Rebuild the service: `docker compose up -d --build nestjs`
   - Check for TypeScript compilation errors
   - Verify package.json dependencies

5. **Port conflicts:**
   - Ensure no other services are using ports 8080, 8081, 11434, or 16686
   - Check Docker port mappings in docker-compose.yml

### Reset Everything

```bash
# Complete reset
docker compose down -v
docker system prune -f
docker compose up -d
```

## Learning OpenTelemetry

This setup is perfect for learning:
- How to add automatic instrumentation to Node.js applications
- Understanding distributed tracing in microservices
- Service-to-service communication patterns
- OpenTelemetry configuration and best practices
- Jaeger trace visualization and analysis

## Next Steps

1. **Add OpenTelemetry Collector** for advanced observability
2. **Implement manual instrumentation** for custom business logic
3. **Add custom metrics** with Prometheus
4. **Explore different tracing scenarios** (async operations, database calls)
5. **Add more services** to demonstrate complex distributed tracing
6. **Implement sampling strategies** for production environments

## Learn More

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Ollama Documentation](https://github.com/ollama/ollama)
- [Express.js Documentation](https://expressjs.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Jaeger Documentation](https://www.jaegertracing.io/docs/)