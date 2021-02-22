import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Validate,
  IsJSON,
} from 'class-validator';
import { IsNumberString } from 'src/common/validators/number-string.validators';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly customerName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly customerEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly customerAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsJSON()
  readonly cartItems: string;

  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsNumberString)
  readonly finalPrice: number;
}
