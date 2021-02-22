import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CompletePaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly razorpayPaymentId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly razorpayOrderId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly razorpaySignature: string;
}
