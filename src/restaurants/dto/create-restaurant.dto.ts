import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IAMUserRegistrationDTO } from './../../iam/dto/iam-registration.dto';

export class CreateRestaurantDto extends IAMUserRegistrationDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly address: string;
}
