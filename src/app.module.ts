import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { IAMModule } from './iam/iam.module';
import { CategoriesModule } from './categories/categories.module';
import { RestaurantUsersModule } from './restaurant-users/restaurant-users.module';
import { BranchesModule } from './branches/branches.module';
import { CatalogueModule } from './catalogue/catalogue.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_URI, {
      useFindAndModify: false,
    }),
    AuthModule,
    IAMModule,
    RestaurantsModule,
    CategoriesModule,
    RestaurantUsersModule,
    BranchesModule,
    CatalogueModule,
    OrdersModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
