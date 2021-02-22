import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { BranchesSchema } from './schema/branches.schema';
import { IAMModule } from './../iam/iam.module';
import { RestaurantUsersModule } from './../restaurant-users/restaurant-users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'branches', schema: BranchesSchema }]),
    forwardRef(() => IAMModule),
    forwardRef(() => RestaurantUsersModule),
  ],
  controllers: [BranchesController],
  providers: [BranchesService],
})
export class BranchesModule {}
