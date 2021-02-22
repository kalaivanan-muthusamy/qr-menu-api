import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogueService } from './catalogue.service';
import { CatalogueController } from './catalogue.controller';
import { CatalogueSchema } from './schema/catalogue.schema';
import { IAMModule } from './../iam/iam.module';
import { RestaurantUsersModule } from './../restaurant-users/restaurant-users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'catalogue', schema: CatalogueSchema }]),
    forwardRef(() => IAMModule),
    forwardRef(() => RestaurantUsersModule),
  ],
  controllers: [CatalogueController],
  providers: [CatalogueService],
  exports: [CatalogueService],
})
export class CatalogueModule {}
