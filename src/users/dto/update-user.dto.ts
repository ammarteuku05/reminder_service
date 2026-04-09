import { IsEmail, IsOptional, IsString, IsISO8601 } from 'class-validator';
import { IsIANATimezone } from './is-timezone.validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsISO8601()
  @IsOptional()
  birthday?: string;

  @IsString()
  @IsOptional()
  @IsIANATimezone()
  timezone?: string;
}
