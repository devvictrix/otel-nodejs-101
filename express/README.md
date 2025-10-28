1. Choose between OTLP Collector and Jaeger
    a. docker run -p 4317:4317 -p 4318:4318 --rm -v $(pwd)/collector-config.yaml:/etc/otelcol/config.yaml otel/opentelemetry-collector
    b. docker run --rm -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 -p 16686:16686 -p 4317:4317 -p 4318:4318 -p 9411:9411 jaegertracing/all-in-one:latest

2. npx tsx app.ts
3. Enter http://localhost:16686
   1. Select OTEL_SERVICE_NAME