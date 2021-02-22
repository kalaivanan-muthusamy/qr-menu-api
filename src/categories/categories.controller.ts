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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './../auth/gaurds/jwt-auth.guard';
import { PermissionsGuard } from './../auth/gaurds/permissions.guard';
import { JWTUser } from 'src/common/interfaces/JWTUser';

@Controller('categories')
@ApiBearerAuth()
@SetMetadata('MODULE', 'CATEGORIES')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @SetMetadata('ACTION', ['CREATE'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    try {
      const user = <JWTUser>req.user;
      return await this.categoriesService.create(createCategoryDto, user);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Get()
  @SetMetadata('ACTION', ['VIEW_ALL'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  findAll(@Request() req) {
    const user = <JWTUser>req.user;
    return this.categoriesService.findAll(user);
  }

  @Get('by_restaurant/:restaurantId')
  findAllByRestaurantId(@Param('restaurantId') restaurantId: string) {
    try {
      return this.categoriesService.findAllByRestaurantId(restaurantId);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.categoriesService.findOne(+id);
  // }

  // @Put(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCategoryDto: UpdateCategoryDto,
  // ) {
  //   return this.categoriesService.update(+id, updateCategoryDto);
  // }

  @Delete(':categoryId')
  @SetMetadata('ACTION', ['DELETE'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async remove(@Param('categoryId') categoryId: string, @Request() req) {
    try {
      const user = <JWTUser>req.user;
      return await this.categoriesService.remove(categoryId, user);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
