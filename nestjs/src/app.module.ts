import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { UserController } from './user.controller'; // --- ADDED for completeness ---
import { WaitingRoomController } from './waiting-room.controller'; // --- ADDED for completeness ---

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [
    AppController,
    BookingController,
    EventController, // <-- This was missing
    SeatController, // <-- This was missing
    UserController,
    WaitingRoomController,
  ],
  providers: [
    PrismaService,
    AppService,
    RedisService,
    BookingService,
    EventService, // <-- This was missing
    SeatService, // <-- This was missing
  ],
})
export class AppModule {}
