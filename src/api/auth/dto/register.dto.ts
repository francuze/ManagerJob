import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;
  
  @ApiProperty()
  @IsNotEmpty()
  lastName: string;
}