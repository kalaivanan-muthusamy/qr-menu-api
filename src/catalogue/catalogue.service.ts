import { Injectable, forwardRef, Inject, HttpException } from '@nestjs/common';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { UpdateCatalogueDto } from './dto/update-catalogue.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CatalogueModel } from './schema/catalogue.schema';
import { RestaurantUsersService } from './../restaurant-users/restaurant-users.service';
import { Model, Types } from 'mongoose';
import { JWTUser } from './../common/interfaces/JWTUser';

@Injectable()
export class CatalogueService {
  constructor(
    @InjectModel('catalogue')
    private readonly catalogueModel: Model<CatalogueModel>,
    @Inject(forwardRef(() => RestaurantUsersService))
    private readonly restaurantUsersService: RestaurantUsersService,
  ) {}

  async create(createCatalogueDto: CreateCatalogueDto, user: JWTUser) {
    const restaurantUser = await this.restaurantUsersService.getIAMUserRestaurantId(
      {
        IAMUserId: user.IAMUserId,
      },
    );
    if (!restaurantUser)
      throw new HttpException("Invalid user. Couldn't add the branch", 400);
    const catalogue = this.catalogueModel.create({
      name: createCatalogueDto.name,
      description: createCatalogueDto.description,
      originalPrice: createCatalogueDto.originalPrice,
      salePrice: createCatalogueDto.salePrice,
      categoryId: createCatalogueDto.categoryId,
      isAvailable: createCatalogueDto.isAvailable,
      branchIds: createCatalogueDto.branchIds
        ? createCatalogueDto.branchIds
            ?.split?.(',')
            .map((b) => Types.ObjectId(b))
        : [],
      restaurantId: restaurantUser.restaurantId,
    });
    return catalogue;
  }

  async findAll(user: JWTUser) {
    const restaurantUser = await this.restaurantUsersService.getIAMUserRestaurantId(
      {
        IAMUserId: user.IAMUserId,
      },
    );
    if (!restaurantUser)
      throw new HttpException("Invalid user. Couldn't add the branch", 400);

    return this.catalogueModel.find({
      restaurantId: restaurantUser.restaurantId,
      isDeleted: false,
    });
  }

  async getCatalogueDetails(catalogueId: string) {
    return await this.catalogueModel.findOne({
      _id: Types.ObjectId(catalogueId),
      isActive: true,
      isDeleted: false,
    });
  }

  async update(
    catalogueId: string,
    updateCatalogueDto: UpdateCatalogueDto,
    user: JWTUser,
  ) {
    const restaurantUser = await this.restaurantUsersService.getIAMUserRestaurantId(
      {
        IAMUserId: user.IAMUserId,
      },
    );
    if (!restaurantUser)
      throw new HttpException("Invalid user. Couldn't add the branch", 400);

    const catalogue = await this.catalogueModel.findOne({
      restaurantId: restaurantUser.restaurantId,
      _id: Types.ObjectId(catalogueId),
      isDeleted: false,
    });
    if (!catalogue)
      throw new HttpException(" Couldn't find this catalogue", 400);
    if (updateCatalogueDto.name) catalogue.name = updateCatalogueDto.name;
    if (updateCatalogueDto.description)
      catalogue.description = updateCatalogueDto.description;
    if (updateCatalogueDto.originalPrice)
      catalogue.originalPrice = updateCatalogueDto.originalPrice;
    if (updateCatalogueDto.salePrice)
      catalogue.salePrice = updateCatalogueDto.salePrice;
    if (updateCatalogueDto.categoryId)
      catalogue.categoryId = Types.ObjectId(updateCatalogueDto.categoryId);
    if (updateCatalogueDto.isAvailable !== undefined)
      catalogue.isAvailable = updateCatalogueDto.isAvailable;
    if (updateCatalogueDto.branchIds)
      catalogue.branchIds = updateCatalogueDto.branchIds
        .split?.(',')
        .map((b) => Types.ObjectId(b));

    await catalogue.save();

    return catalogue;
  }

  async remove(catalogueId: string, user: JWTUser) {
    const restaurantUser = await this.restaurantUsersService.getIAMUserRestaurantId(
      {
        IAMUserId: user.IAMUserId,
      },
    );
    if (!restaurantUser)
      throw new HttpException("Invalid user. Couldn't add the branch", 400);

    const isDeleted = await this.catalogueModel.deleteOne({
      restaurantId: restaurantUser.restaurantId,
      _id: Types.ObjectId(catalogueId),
      isDeleted: false,
    });

    if (isDeleted) return 'Catalogue delete sucessfully';
    throw new HttpException("Couldn't delete the catalogue", 400);
  }

  async getCatalogueByRestaurant(branchId: string) {
    return this.catalogueModel.find({
      branchIds: Types.ObjectId(branchId),
      isActive: true,
      isDeleted: false,
    });
  }
}
