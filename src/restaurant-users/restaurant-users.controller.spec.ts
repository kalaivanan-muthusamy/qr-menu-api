import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantUsersController } from './restaurant-users.controller';
import { RestaurantUsersService } from './restaurant-users.service';

describe('RestaurantUsersController', () => {
  let controller: RestaurantUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantUsersController],
      providers: [RestaurantUsersService],
    }).compile();

    controller = module.get<RestaurantUsersController>(RestaurantUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
