import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { RestaurantUsersModel } from './schema/restaurant-users.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RestaurantUsersService {
  constructor(
    @InjectModel('restaurant-users')
    private readonly restaurantUsersModel: Model<RestaurantUsersModel>,
  ) {}

  async getIAMUserRestaurantId({ IAMUserId }) {
    const restaurantUser = this.restaurantUsersModel.findOne({
      IAMUserId: Types.ObjectId(IAMUserId),
      isActive: true,
      isDeleted: false,
    });
    return restaurantUser;
  }
}
