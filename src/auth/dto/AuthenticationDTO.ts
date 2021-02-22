import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthenticationDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly mobileNumber: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}
