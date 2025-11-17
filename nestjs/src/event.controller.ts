import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('api/events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get(':id')
  async getEventById(@Param('id') id: string) {
    try {
      const eventId = parseInt(id, 10);
      if (isNaN(eventId)) {
        throw new HttpException('Invalid event ID', HttpStatus.BAD_REQUEST);
      }
      return await this.eventService.getEventById(eventId);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND || error.status === HttpStatus.BAD_REQUEST) {
        throw error;
      }
      console.error('Unhandled event error:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}