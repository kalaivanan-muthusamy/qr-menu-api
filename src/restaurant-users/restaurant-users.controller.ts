import { Controller } from '@nestjs/common';
import { RestaurantUsersService } from './restaurant-users.service';

@Controller('restaurant-users')
export class RestaurantUsersController {
  constructor(private readonly restaurantUsersService: RestaurantUsersService) {}
}
