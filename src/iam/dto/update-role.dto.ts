import { ApiProperty, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { AddRoleDto } from './add-role.dto';

export class UpdateRoleDto extends OmitType(AddRoleDto, ['key']) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly roleId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly isActive: boolean;
}
