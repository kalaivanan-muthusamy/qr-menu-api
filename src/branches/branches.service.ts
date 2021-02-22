import { Injectable, forwardRef, Inject, HttpException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Model, Types } from 'mongoose';
import { BranchesModel } from './schema/branches.schema';
import { InjectModel } from '@nestjs/mongoose';
import { RestaurantUsersService } from './../restaurant-users/restaurant-users.service';
import { JWTUser } from './../common/interfaces/JWTUser';

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel('branches')
    private readonly branchesModel: Model<BranchesModel>,
    @Inject(forwardRef(() => RestaurantUsersService))
    private readonly restaurantUsersService: RestaurantUsersService,
  ) {}

  async create(createBranchDto: CreateBranchDto, user: JWTUser) {
    const restaurantUser = await this.restaurantUsersService.getIAMUserRestaurantId(
      {
        IAMUserId: user.IAMUserId,
      },
    );
    if (!restaurantUser)
      throw new HttpException("Invalid user. Couldn't add the branch", 400);
    const branches = this.branchesModel.create({
      name: createBranchDto.name,
      description: createBranchDto.description,
      address: createBranchDto.address,
      restaurantId: restaurantUser.restaurantId,
    });
    return branches;
  }

  async findAll(user: JWTUser) {
    const restaurantUser = await this.restaurantUsersService.getIAMUserRestaurantId(
      {
        IAMUserId: user.IAMUserId,
      },
    );
    if (!restaurantUser)
      throw new HttpException("Invalid user. Couldn't add the branch", 400);
    return this.branchesModel.find({
      restaurantId: restaurantUser.restaurantId,
    });
  }

  async findOne(branchId: string) {
    return await this.branchesModel.findOne({ _id: Types.ObjectId(branchId) });
  }

  update(id: number, updateBranchDto: UpdateBranchDto) {
    return `This action updates a #${id} branch`;
  }

  async remove(branchId: string, user: JWTUser) {
    const restaurantUser = await this.restaurantUsersService.getIAMUserRestaurantId(
      {
        IAMUserId: user.IAMUserId,
      },
    );
    if (!restaurantUser)
      throw new HttpException("Invalid user. Couldn't add the category", 400);
    const isDeleted = await this.branchesModel.deleteOne({
      _id: Types.ObjectId(branchId),
      restaurantId: restaurantUser.restaurantId,
    });
    if (isDeleted) return 'Branch deleted successfully';
    throw new HttpException('Unable to delete this branch', 400);
  }
}
