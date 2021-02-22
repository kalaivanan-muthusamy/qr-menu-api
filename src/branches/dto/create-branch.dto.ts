import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBranchDto {
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
