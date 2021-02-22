import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesSchema } from './schema/category.schema';
import { IAMModule } from './../iam/iam.module';
import { RestaurantUsersModule } from './../restaurant-users/restaurant-users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'categories', schema: CategoriesSchema },
    ]),
    forwardRef(() => IAMModule),
    forwardRef(() => RestaurantUsersModule),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
