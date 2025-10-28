/*manual-instrumentation.ts*/

import { trace, metrics, SpanStatusCode } from '@opentelemetry/api';

// Create tracer and meter for manual instrumentation
const tracer = trace.getTracer('express-b-manual');
const meter = metrics.getMeter('express-b-manual');

// Create metrics for rolldice operation
export const rollDiceCounter = meter.createCounter('rolldice.requests', {
  description: 'Number of dice roll requests'
});

export const rollDiceValueHistogram = meter.createHistogram('rolldice.value', {
  description: 'Distribution of dice roll values',
  unit: '1'
});

// Manual instrumentation function for rolldice
export function instrumentRollDice(rollFunction: () => number): number {
  const span = tracer.startSpan('rolldice.operation');
  
  try {
    // Set span attributes
    span.setAttribute('operation.name', 'roll_dice');
    span.setAttribute('operation.type', 'random_generation');
    
    // Add an event for the start of the operation
    span.addEvent('Starting dice roll');
    
    // Perform the actual dice roll
    const result = rollFunction();
    
    // Record the result in the span
    span.setAttribute('rolldice.result', result);
    span.setAttribute('rolldice.min', 1);
    span.setAttribute('rolldice.max', 6);
    
    // Add an event for the result
    span.addEvent('Dice rolled', { result: result.toString() });
    
    // Record metrics
    rollDiceCounter.add(1, { 
      result: result.toString(),
      status: 'success'
    });
    
    rollDiceValueHistogram.record(result);
    
    // Set span status to success
    span.setStatus({ code: SpanStatusCode.OK });
    
    return result;
    
  } catch (error: any) {
    // Record error in span
    span.recordException(error as Error);
    span.setStatus({ 
      code: SpanStatusCode.ERROR, 
      message: error.message 
    });
    
    // Record error metrics
    rollDiceCounter.add(1, { 
      status: 'error',
      error: error.constructor.name
    });
    
    throw error;
    
  } finally {
    // Always end the span
    span.end();
  }
}

// Alternative: Context-aware instrumentation function
export function instrumentRollDiceWithContext(
  rollFunction: () => number, 
  parentContext?: any
): number {
  return tracer.startActiveSpan('rolldice.operation', parentContext, (span) => {
    try {
      span.setAttribute('operation.name', 'roll_dice');
      
      const result = rollFunction();
      
      span.setAttribute('rolldice.result', result);
      span.addEvent('Dice rolled', { result: result.toString() });
      
      // Record metrics
      rollDiceCounter.add(1, { result: result.toString() });
      rollDiceValueHistogram.record(result);
      
      span.setStatus({ code: SpanStatusCode.OK });
      
      return result;
      
    } catch (error: any) {
      span.recordException(error as Error);
      span.setStatus({ 
        code: SpanStatusCode.ERROR, 
        message: error.message 
      });
      
      rollDiceCounter.add(1, { 
        status: 'error',
        error: error.constructor.name
      });
      
      throw error;
    } finally {
      span.end();
    }
  });
}

// Additional utility functions for other operations
export function createCustomSpan(name: string, attributes?: Record<string, any>) {
  const span = tracer.startSpan(name);
  
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      span.setAttribute(key, value);
    });
  }
  
  return span;
}

// Function to record custom metrics
export function recordCustomMetric(
  metricName: string, 
  value: number, 
  attributes?: Record<string, any>
) {
  const counter = meter.createCounter(metricName);
  counter.add(value, attributes || {});
}
