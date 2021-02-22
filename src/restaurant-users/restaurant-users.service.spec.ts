import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantUsersService } from './restaurant-users.service';

describe('RestaurantUsersService', () => {
  let service: RestaurantUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantUsersService],
    }).compile();

    service = module.get<RestaurantUsersService>(RestaurantUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
