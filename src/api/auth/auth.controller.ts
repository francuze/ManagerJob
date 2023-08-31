import { Controller, Post, Body, Req,UseGuards, Get, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiBody,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/JwtAuthGuard';


@ApiTags('auth')
@ApiBearerAuth('access-token')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterDTO })
  @ApiCreatedResponse({ description: 'User successfully registered.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async register(@Body() registerDTO: RegisterDTO) {
    this.authService.register(registerDTO);
  }

  @Post('login')
  @ApiBody({ type: LoginDTO })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async login(@Body() loginDTO: LoginDTO) {
    return await this.authService.login(loginDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiResponse({ status: 200, description: 'User successfully logged out.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async logout(@Req() req) {
    
    const token = req.headers.authorization.split(' ')[1]; // Извлекаем токен из заголовка

    await this.authService.logout(token);
    
    return { message: 'Logged out successfully' };
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async me(@Req() req) {
    return await req.user;
  }
}
