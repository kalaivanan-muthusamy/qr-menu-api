import { Injectable, HttpException, forwardRef, Inject } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { IAMService } from './../iam/iam.service';
import { STATIC_ROLES } from './../app.constants';
import { IAMRolesModel } from 'src/iam/iam-roles.schema';
import { RestaurantsModel } from './schema/restaurant.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RestaurantsService {
  private _className = 'RestaurantsService';

  constructor(
    @InjectModel('restaurants')
    private readonly restaurantsModel: Model<RestaurantsModel>,
    @Inject(forwardRef(() => IAMService))
    private readonly iamService: IAMService,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    try {
      // Get the restaurant administrator role
      const roleDetails = <IAMRolesModel>await this.iamService.getRoleDetails({
        role: STATIC_ROLES.RESTAURANT_ADMIN,
      });

      // Create a IAM User for Restaurant Administrator
      const iamUser = await this.iamService.registerUser({
        iamName: createRestaurantDto.iamName,
        iamEmail: createRestaurantDto.iamEmail,
        iamMobileNumber: createRestaurantDto.iamMobileNumber,
        iamPassword: createRestaurantDto.iamPassword,
        iamCountry: createRestaurantDto.iamCountry,
        iamRoleId: roleDetails._id,
      });

      // Create Restaurant details
      const restaurantDetails = await this.restaurantsModel.create({
        name: createRestaurantDto.name,
        description: createRestaurantDto.description,
        address: createRestaurantDto.address,
      });

      return {
        ...restaurantDetails.toObject(),
        ...iamUser.toObject(),
      };
    } catch (err) {
      console.error(this._className, 'create', err);
      throw new HttpException('Unable to create a new restaurant', 500);
    }
  }

  async findAll() {
    return await this.restaurantsModel.find();
  }

  async findOne(restaurantId: string) {
    return await this.restaurantsModel.findOne({
      _id: Types.ObjectId(restaurantId),
    });
  }

  update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    return `This action updates a #${id} restaurant`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}
