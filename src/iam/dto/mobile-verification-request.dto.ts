import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MobileVerificationRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  mobileNumber: string;
}
