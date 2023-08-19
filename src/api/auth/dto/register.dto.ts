import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class RegisterDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}