import { Injectable, UnauthorizedException, Res, HttpException, HttpStatus,NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service'; // Подставьте путь к вашему UserService
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly invalidatedTokens: Set<string> = new Set<string>(); // Черный список токенов

  async validateToken(token: string): Promise<boolean> {
    // Проверяем, не находится ли токен в черном списке
    return !this.invalidatedTokens.has(token);
  }
  
  async validateUserById(userId: number) {
    // Fetch the user from the database using the UserService
    const user = await this.userService.findById(userId);
    if (!user) {
      return null; // User not found
    }
    // You can perform additional checks or validations here if needed
    return user;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
      
    return null;
  }

  async login(loginDTO: LoginDTO): Promise<any> {
    const user = await this.validateUser(loginDTO.email, loginDTO.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    

    return { accessToken, userId: user.id };
  }
  async register(registerDTO: RegisterDTO): Promise<any> {
    const { email, password,firstName,lastName } = registerDTO;

    // Проверяем, не существует ли пользователь с таким email
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new HttpException(
        'User with that email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Хешируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем нового пользователя с хешированным паролем
    const newUser = await this.userService.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    // Генерируем токен
    const payload = { email: newUser.email, sub: newUser.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
  async logout(token: string): Promise<void> {
    const user = await this.validateToken(token)

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Добавляем токен в черный список
    this.invalidatedTokens.add(token);
  }
}
