// modules/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('login-with-token')
  @HttpCode(HttpStatus.OK)
  async loginWithToken(@Body('idToken') idToken: string): Promise<AuthResponseDto> {
    return this.authService.loginWithIdToken(idToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body('uid') uid: string): Promise<{ message: string }> {
    return this.authService.logout(uid);
  }

  /*
  @Get('profile')
  @UseGuards(AuthGuard) // Implementar después
  async getProfile(@Request() req) {
    return req.user;
  }*/
}
