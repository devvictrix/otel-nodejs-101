import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

const TEN_MINUTES_IN_SECONDS = 600;

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: 'redis', // The service name from docker-compose
      port: 6379,
    });
    console.log('✅ Connected to Redis');
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  /**
   * Attempts to lock a seat for a specific user.
   * Uses SET with NX and EX flags for an atomic "set if not exists with expiration".
   * @param eventId The ID of the event.
   * @param seatNumber The seat number (e.g., "A1").
   * @param userId The ID of the user attempting to lock the seat.
   * @returns 'OK' if the lock was successful, null otherwise.
   */
  async lockSeat(
    eventId: number,
    seatNumber: string,
    userId: number,
  ): Promise<'OK' | null> {
    const key = `seat:${eventId}:${seatNumber}`;
    const value = `user:${userId}`;
    // 'NX' => only set the key if it does not already exist.
    // 'EX' => set an expiration time in seconds.
    return this.client.set(key, value, 'EX', TEN_MINUTES_IN_SECONDS, 'NX');
  }

  async releaseSeat(eventId: number, seatNumber: string): Promise<number> {
    const key = `seat:${eventId}:${seatNumber}`;
    return this.client.del(key);
  }

  async getSeatLock(
    eventId: number,
    seatNumber: string,
  ): Promise<string | null> {
    const key = `seat:${eventId}:${seatNumber}`;
    return this.client.get(key);
  }
}
