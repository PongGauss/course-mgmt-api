import { CourseCategory } from '.prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsEnum,
  IsOptional,
  IsDate,
  IsNumber,
  Min,
} from 'class-validator';

export class CourseCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsDate()
  @IsNotEmpty()
  started_at: Date;

  @IsDate()
  @IsNotEmpty()
  ended_at: Date;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  opened_seat: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(CourseCategory)
  category: string;
}
