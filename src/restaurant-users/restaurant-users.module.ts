import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantUsersService } from './restaurant-users.service';
import { RestaurantUsersController } from './restaurant-users.controller';
import { RestaurantUsersSchema } from './schema/restaurant-users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'restaurant-users', schema: RestaurantUsersSchema },
    ]),
  ],
  controllers: [RestaurantUsersController],
  providers: [RestaurantUsersService],
  exports: [RestaurantUsersService],
})
export class RestaurantUsersModule {}
