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
import { CatalogueService } from './catalogue.service';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { UpdateCatalogueDto } from './dto/update-catalogue.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from './../auth/gaurds/permissions.guard';
import { JwtAuthGuard } from './../auth/gaurds/jwt-auth.guard';
import { JWTUser } from './../common/interfaces/JWTUser';

@Controller('catalogue')
@ApiBearerAuth()
@SetMetadata('MODULE', 'CATALOGUE')
export class CatalogueController {
  constructor(private readonly catalogueService: CatalogueService) {}

  @Post()
  @SetMetadata('ACTION', ['CREATE'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async create(@Body() createCatalogueDto: CreateCatalogueDto, @Request() req) {
    try {
      const user = <JWTUser>req.user;
      return await this.catalogueService.create(createCatalogueDto, user);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Get()
  @SetMetadata('ACTION', ['VIEW_ALL'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async findAll(@Request() req) {
    try {
      const user = <JWTUser>req.user;
      return await this.catalogueService.findAll(user);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.catalogueService.findOne(+id);
  // }

  @Put(':catalogueId')
  @Get()
  @SetMetadata('ACTION', ['UPDATE'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async update(
    @Param('catalogueId') catalogueId: string,
    @Body() updateCatalogueDto: UpdateCatalogueDto,
    @Request() req,
  ) {
    try {
      const user = <JWTUser>req.user;
      return await this.catalogueService.update(
        catalogueId,
        updateCatalogueDto,
        user,
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Delete(':catalogueId')
  @Get()
  @SetMetadata('ACTION', ['DELETE'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async delete(@Param('catalogueId') catalogueId: string, @Request() req) {
    try {
      const user = <JWTUser>req.user;
      return await this.catalogueService.remove(catalogueId, user);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Get('by_branch/:branchId')
  async getCatalogueByRestaurant(@Param('branchId') branchId: string) {
    try {
      return await this.catalogueService.getCatalogueByRestaurant(branchId);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
