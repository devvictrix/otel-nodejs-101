import { Controller, Get } from '@nestjs/common';

@Controller('waiting-room')
export class WaitingRoomController {
  @Get()
  async getWaitingRoomStatus() {
    // Mock implementation - always returns proceed status
    return {
      status: 'proceed_to_booking',
      message: 'Waiting room is available, you can proceed to booking'
    };
  }
}