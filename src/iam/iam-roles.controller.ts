import {
  Controller,
  SetMetadata,
  UseGuards,
  Get,
  HttpException,
  InternalServerErrorException,
  Body,
  Post,
  Put,
} from '@nestjs/common';
import { IAMService } from './iam.service';
import { JwtStrategy } from './../auth/jwt.strategy';
import { AddRoleDto } from './dto/add-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('iam/roles')
@SetMetadata('MODULE', 'IAM_ROLES')
export class IAMRolesController {
  constructor(private readonly iamService: IAMService) {}

  @Get('')
  @SetMetadata('ACTION', ['VIEW_ALL'])
  @UseGuards(JwtStrategy)
  async allRoles() {
    try {
      return await this.iamService.getAllRoles();
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      else throw new InternalServerErrorException();
    }
  }

  @Post('')
  @SetMetadata('ACTION', ['ADD'])
  @UseGuards(JwtStrategy)
  async addRole(@Body() addRoleDto: AddRoleDto) {
    try {
      return await this.iamService.addRole(addRoleDto);
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      else throw new InternalServerErrorException();
    }
  }

  @Put('')
  @SetMetadata('ACTION', ['UPDATE'])
  @UseGuards(JwtStrategy)
  async updateRole(@Body() updateRoleDto: UpdateRoleDto) {
    try {
      return await this.iamService.updateRole(updateRoleDto);
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      else throw new InternalServerErrorException();
    }
  }
}
