import { IsNotEmpty, IsString, Validate, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BooleanTransformer } from '../../common/transformers/boolean.transformer';
import { Transform } from 'class-transformer';
import { IsNumberString } from 'src/common/validators/number-string.validators';

export class CreateCatalogueDto {
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
  @Validate(IsNumberString)
  readonly originalPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsNumberString)
  readonly salePrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(BooleanTransformer)
  readonly isAvailable: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly categoryId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly branchIds: string;
}
