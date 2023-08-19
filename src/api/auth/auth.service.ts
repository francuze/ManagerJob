import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service'; // Подставьте путь к вашему UserService
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user && await user.comparePassword(password)) {
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

    return { accessToken };
  }
  async register(registerDTO: RegisterDTO): Promise<any> {
    const { email } = registerDTO;

    // Проверяем, не существует ли пользователь с таким email
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Создаем нового пользователя
    const newUser = await this.userService.createUser(registerDTO);

    // Генерируем токен
    const payload = { email: newUser.email, sub: newUser.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
