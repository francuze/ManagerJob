import { Controller,Post,Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { ApiParam } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO) {
    this.authService.register(registerDTO)
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    console.log(loginDTO);
    
    return this.authService.login(loginDTO);
  }

}