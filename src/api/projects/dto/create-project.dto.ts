import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateProjectDTO {

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsArray()
  users: number[]; // Массив идентификаторов пользователей
  
  @ApiProperty()
  @IsNotEmpty()
  ownerId: number; // Идентификатор владельца проекта

}