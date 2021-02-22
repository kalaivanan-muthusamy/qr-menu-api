import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { IAMModule } from './../iam/iam.module';
import { RestaurantsSchema } from './schema/restaurant.schema';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  imports: [
    MongooseModule.forFeature([
      { name: 'restaurants', schema: RestaurantsSchema },
    ]),
    forwardRef(() => IAMModule),
  ],
})
export class RestaurantsModule {}
