import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EmailVerificationRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  email: string;
}
