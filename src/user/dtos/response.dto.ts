import {
  IsNumber,
  IsPositive,
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class UserProfileResponseDto {
  @Exclude()
  id: number;

  uuid: string;

  @Expose({ name: 'firstName' })
  first_name: string;

  @Expose({ name: 'lastName' })
  last_name: string;

  @Expose({ name: 'nickName' })
  nick_name: string;

  email: string;
  gender: string;
  role: string;
  birthDate: Date;
  @Exclude()
  password: string;

  created_at: Date;
  @Exclude()
  updated_at: Date;
  @Exclude()
  deleted_at: Date;

  constructor(partial: Partial<UserProfileResponseDto>) {
    Object.assign(this, partial);
  }
}
