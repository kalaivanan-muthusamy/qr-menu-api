import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersSchema } from './schema/orders.schema';
import { OrderSessionsSchema } from './schema/order-sessions.schema';
import { CatalogueModule } from './../catalogue/catalogue.module';
import { PaymentModule } from './../payment/payment.module';
import { RestaurantUsersModule } from './../restaurant-users/restaurant-users.module';
import { IAMModule } from './../iam/iam.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'orders', schema: OrdersSchema },
      { name: 'order-sessions', schema: OrderSessionsSchema },
    ]),
    forwardRef(() => IAMModule),
    CatalogueModule,
    PaymentModule,
    RestaurantUsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
