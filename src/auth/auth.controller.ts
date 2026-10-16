import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service.js';
import { loginDto } from './dto/auth-dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: loginDto) {
    return this.authService.login(loginDto);
  }
}
