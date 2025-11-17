# Thundering Herd Problem - NestJS Prototype

This project implements a prototype solution for the thundering herd problem in a ticket booking system using NestJS, Redis, and PostgreSQL.

## Architecture

The system uses a monolithic NestJS architecture with the following key components:

- **Redis**: For atomic seat locking using `SETEX` operations
- **PostgreSQL**: For persistent data storage (users, events, seats, bookings)
- **NestJS**: Web framework providing REST API endpoints

## Core Features

1. **Seat Locking Mechanism**: Atomic seat locking using Redis to prevent double bookings
2. **Booking Service**: Creates bookings with PENDING status and 10-minute expiration
3. **Event Management**: API to view event details and available seats
4. **Mock Endpoints**: Simplified user login and waiting room for testing

## Setup Instructions

### Prerequisites

- Docker and Docker Compose
- Node.js (for running k6 load tests)
- k6 (for load testing)

### 1. Start the Infrastructure

```bash
# Start all services
docker-compose up -d --build

# Wait for all services to be ready
# You can check logs with: docker-compose logs -f nestjs
```

### 2. Initialize the Database

```bash
# Enter the NestJS container
docker exec -it nestjs bash

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with test data
npm run seed
```

### 3. Verify the Setup

Test that the API is working:

```bash
# Check available seats
curl http://localhost:8080/api/seats/available?eventId=1

# Get event details
curl http://localhost:8080/api/events/1

# Test mock login
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test waiting room
curl http://localhost:8080/waiting-room
```

### 4. Load Testing

#### Simple Load Test

```bash
# Install k6 if not already installed
# (Follow instructions at https://k6.io/docs/getting-started/installation/)

# Run the simple load test
k6 run load-testing/simple-load-test.js
```

#### Advanced Load Test

```bash
# Run the comprehensive load test
k6 run load-testing/booking-load-test.js
```

## API Endpoints

### Core Booking Endpoints

- `POST /api/bookings` - Create a new booking (HOTSPOT)
- `GET /api/events/:id` - Get event details
- `GET /api/seats/available` - Get available seats for an event

### Mock Endpoints

- `POST /api/users/login` - Mock user authentication
- `GET /waiting-room` - Mock waiting room status

## Key Implementation Details

### Redis Seat Locking

The system uses Redis `SETEX` with NX (Not Exists) flag for atomic seat locking:

```typescript
// Lock a seat for 10 minutes
await redis.set(key, value, 'EX', 600, 'NX');
```

This ensures that only one user can successfully lock a seat at a time, preventing double bookings.

### Booking Flow

1. Client requests to book a seat
2. System attempts atomic lock in Redis
3. If successful, creates PENDING booking in PostgreSQL
4. Updates seat status to HELD
5. Returns booking details with 10-minute expiration

## Load Testing Scenarios

The load testing includes multiple scenarios:

1. **Normal Load**: Multiple users booking different seats
2. **Thundering Herd**: Many users trying to book the same popular seat
3. **High Concurrency**: Large number of users with different seats

## Monitoring

- **Jaeger**: Available at http://localhost:16686 for distributed tracing
- **Application Logs**: Console output for debugging
- **k6 Metrics**: Built-in performance metrics

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 5432, 6379, 8080, and 16686 are available
2. **Database Connection**: Check PostgreSQL is running and accessible
3. **Redis Connection**: Verify Redis is running and accessible

### Resetting the System

```bash
# Stop all services
docker-compose down

# Remove volumes (optional, deletes all data)
docker-compose down -v

# Start fresh
docker-compose up -d --build
```

## Development Notes

- The system is designed for prototype/testing purposes
- Error handling focuses on preventing race conditions
- All seat locks expire after 10 minutes
- The system uses optimistic locking with Redis as the source of truth

docker compose exec postgres psql -U admin -d mydb -c "SHOW max_connections;"

## Jaeger
  - https://www.jaegertracing.io/docs/2.11/architecture/spm/