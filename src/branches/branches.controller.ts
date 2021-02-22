import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  SetMetadata,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from './../auth/gaurds/permissions.guard';
import { JwtAuthGuard } from './../auth/gaurds/jwt-auth.guard';
import { JWTUser } from './../common/interfaces/JWTUser';

@Controller('branches')
@ApiBearerAuth()
@SetMetadata('MODULE', 'BRANCHES')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @SetMetadata('ACTION', ['CREATE'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async create(@Body() createBranchDto: CreateBranchDto, @Request() req) {
    try {
      const user = <JWTUser>req.user;
      return await this.branchesService.create(createBranchDto, user);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Get()
  @SetMetadata('ACTION', ['VIEW_ALL'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  findAll(@Request() req) {
    try {
      const user = <JWTUser>req.user;
      return this.branchesService.findAll(user);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Get(':branchId')
  async findOne(@Param('branchId') branchId: string) {
    try {
      return await this.branchesService.findOne(branchId);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
  //   return this.branchesService.update(+id, updateBranchDto);
  // }

  @Delete(':branchId')
  @SetMetadata('ACTION', ['DELETE'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async remove(@Param('branchId') branchId: string, @Request() req) {
    try {
      const user = <JWTUser>req.user;
      return await this.branchesService.remove(branchId, user);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
