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
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './../auth/gaurds/jwt-auth.guard';
import { PermissionsGuard } from './../auth/gaurds/permissions.guard';

@Controller('restaurants')
@ApiBearerAuth()
@SetMetadata('MODULE', 'RESTAURANTS')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    try {
      return await this.restaurantsService.create(createRestaurantDto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Get()
  @SetMetadata('ACTION', ['VIEW_ALL'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async findAll() {
    return await this.restaurantsService.findAll();
  }

  @Get(':restaurantId')
  // @SetMetadata('ACTION', ['VIEW'])
  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  async findOne(@Param('restaurantId') restaurantId: string) {
    return await this.restaurantsService.findOne(restaurantId);
  }

  // @Put(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateRestaurantDto: UpdateRestaurantDto,
  // ) {
  //   return this.restaurantsService.update(+id, updateRestaurantDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.restaurantsService.remove(+id);
  // }
}
