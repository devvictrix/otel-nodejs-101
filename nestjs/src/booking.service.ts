import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { RedisService } from './redis.service';
import { PrismaService } from './prisma.service';
import { Booking } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async createBooking(dto: {
    userId: number;
    eventId: number;
    seatNumber: string;
  }): Promise<Booking> {
    const { userId, eventId, seatNumber } = dto;

    // 1. Attempt to lock the seat atomically in Redis
    const lock = await this.redis.lockSeat(eventId, seatNumber, userId);

    if (!lock) {
      // If lock is null, it means the key already exists (seat is taken/held)
      throw new ConflictException(
        `Seat ${seatNumber} is already held or booked.`,
      );
    }

    // 2. If lock is successful, use a transaction to create a PENDING booking
    //    and update the seat status in PostgreSQL.
    try {
      const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000);

      // Find the seat first to ensure it exists
      const seat = await this.prisma.seat.findUnique({
        where: {
          eventId_seatNumber: {
            eventId,
            seatNumber,
          },
        },
      });

      if (!seat) {
        throw new NotFoundException(
          `Seat ${seatNumber} for event ${eventId} not found.`,
        );
      }

      // Create booking and connect the seat within a transaction
      const booking = await this.prisma.booking.create({
        data: {
          userId,
          status: 'PENDING',
          expiresAt: tenMinutesFromNow,
          seats: {
            connect: {
              id: seat.id,
            },
          },
        },
      });

      // Update seat status separately
      await this.prisma.seat.update({
        where: { id: seat.id },
        data: { status: 'HELD' },
      });

      return booking;
    } catch (error) {
      // If creating the booking in PG fails, we must release the lock in Redis
      await this.redis.releaseSeat(eventId, seatNumber);
      throw error; // Re-throw the original error
    }
  }
}
