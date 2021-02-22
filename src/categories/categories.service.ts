import { Injectable, forwardRef, Inject, HttpException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JWTUser } from './../common/interfaces/JWTUser';
import { CategoriesModel } from './schema/category.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RestaurantUsersService } from './../restaurant-users/restaurant-users.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('categories')
    private readonly categoriesModel: Model<CategoriesModel>,
    @Inject(forwardRef(() => RestaurantUsersService))
    private readonly restaurantUsersService: RestaurantUsersService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: JWTUser) {
    const restaurantUser = await this.restaurantUsersService.getIAMUserRestaurantId(
      {
        IAMUserId: user.IAMUserId,
      },
    );
    if (!restaurantUser)
      throw new HttpException("Invalid user. Couldn't add the category", 400);
    const category = this.categoriesModel.create({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
      restaurantId: restaurantUser.restaurantId,
    });
    return category;
  }

  async findAll(user: JWTUser) {
    const restaurantUser = await this.restaurantUsersService.getIAMUserRestaurantId(
      {
        IAMUserId: user.IAMUserId,
      },
    );
    if (!restaurantUser)
      throw new HttpException("Invalid user. Couldn't add the category", 400);
    return this.categoriesModel.find({
      restaurantId: restaurantUser.restaurantId,
    });
  }

  async findAllByRestaurantId(restaurantId: string) {
    return this.categoriesModel.find({
      restaurantId: Types.ObjectId(restaurantId),
      isActive: true,
      isDeleted: false,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  async remove(categoryId: string, user: JWTUser) {
    const restaurantUser = await this.restaurantUsersService.getIAMUserRestaurantId(
      {
        IAMUserId: user.IAMUserId,
      },
    );
    if (!restaurantUser)
      throw new HttpException("Invalid user. Couldn't add the category", 400);
    const isDeleted = await this.categoriesModel.deleteOne({
      _id: Types.ObjectId(categoryId),
      restaurantId: restaurantUser.restaurantId,
    });
    if (isDeleted) return 'Category deleted successfully';
    throw new HttpException('Unable to delete this category', 400);
  }
}
