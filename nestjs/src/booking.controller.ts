import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { BookingService } from './booking.service';

class CreateBookingDto {
  userId: number;
  eventId: number;
  seatNumber: string;
}

@Controller('api/bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(@Body() body: CreateBookingDto) {
    try {
      return await this.bookingService.createBooking(body);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        // Re-throw known exceptions directly, OTel will not mark them as span errors
        throw error;
      }

      console.error('Unhandled booking error:', error);

      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
