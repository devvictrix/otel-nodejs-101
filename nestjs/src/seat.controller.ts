import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { SeatService } from './seat.service';

@Controller('api/seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Get('available')
  async getAvailableSeats(@Query('eventId') eventId: string) {
    try {
      const parsedEventId = parseInt(eventId, 10);
      if (isNaN(parsedEventId)) {
        throw new HttpException('Invalid event ID', HttpStatus.BAD_REQUEST);
      }
      return await this.seatService.getAvailableSeats(parsedEventId);
    } catch (error) {
      if (error.status === HttpStatus.BAD_REQUEST) {
        throw error;
      }
      console.error('Unhandled seat error:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}