import { UserRole, Gender } from '.prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsEnum,
  IsOptional,
  IsDate,
} from 'class-validator';

import { Match } from '../../decorator/match.decorator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  nickName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsString()
  @MinLength(5)
  @Match('password')
  passwordConfirm: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: string;

  @IsDate()
  @IsNotEmpty()
  birthDate: Date;
}

export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
