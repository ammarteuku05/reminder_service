import { IsEmail, IsNotEmpty, IsString, IsISO8601 } from 'class-validator';
import { IsIANATimezone } from './is-timezone.validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsISO8601()
  @IsNotEmpty()
  birthday: string;

  @IsString()
  @IsNotEmpty()
  @IsIANATimezone()
  timezone: string;
}
