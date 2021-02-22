import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MobileVerificationDto {
  @ApiProperty()
  @IsNotEmpty()
  mobileNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  otp: string;
}
