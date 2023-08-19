import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}