import { IsNotEmpty, IsEmail } from 'class-validator';

export class UpdateUserDTO {
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}
