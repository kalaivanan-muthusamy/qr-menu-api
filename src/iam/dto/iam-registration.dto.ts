import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class IAMUserRegistrationDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly iamName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly iamEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  readonly iamMobileNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly iamPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly iamCountry: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly iamRoleId: string;
}
