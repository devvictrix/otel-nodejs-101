import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';

class LoginDto {
  email: string;
  password: string;
}

@Controller('api/users')
export class UserController {
  @Post('login')
  async login(@Body() body: LoginDto) {
    // Mock implementation - always returns a dummy user
    return {
      id: 1,
      email: body.email,
      name: 'Test User',
      token: 'mock-jwt-token-12345'
    };
  }
}