import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('api')
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHello(): string {
    return 'Thundering Herd Prototype API is running!';
  }

  // Mock endpoint to simulate entering a waiting room
  @Get('/waiting-room')
  enterWaitingRoom() {
    return { status: 'proceed_to_booking' };
  }

  // Endpoint to get available seats for a specific event (for testing)
  @Get('events/:id/seats/available')
  async getAvailableSeats(@Param('id') id: string) {
    const eventId = Number(id);
    return this.prisma.seat.findMany({
      where: {
        eventId: eventId,
        status: 'AVAILABLE',
      },
      select: {
        seatNumber: true,
      },
    });
  }
}
