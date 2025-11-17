import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Seat } from '@prisma/client';

@Injectable()
export class SeatService {
  constructor(private prisma: PrismaService) {}

  async getAvailableSeats(eventId: number): Promise<Seat[]> {
    return this.prisma.seat.findMany({
      where: {
        eventId,
        status: 'AVAILABLE',
      },
    });
  }
}