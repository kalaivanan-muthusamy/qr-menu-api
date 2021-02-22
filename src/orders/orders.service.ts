import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderSessionsModel } from './schema/order-sessions.schema';
import { OrdersModel } from './schema/orders.schema';
import { CatalogueService } from './../catalogue/catalogue.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  ORDER_SESSION_TYPES,
  PAYMENT_MODES,
  PAYMENT_STATUSES,
} from './orders.constants';
import { PaymentService } from './../payment/payment.service';
import { CompletePaymentDto } from './dto/complete-payment.dto';
import { JWTUser } from './../common/interfaces/JWTUser';
import { RestaurantUsersService } from './../restaurant-users/restaurant-users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('orders')
    private readonly ordersModel: Model<OrdersModel>,
    @InjectModel('order-sessions')
    private readonly orderSessionsModel: Model<OrderSessionsModel>,
    private readonly catalogueService: CatalogueService,
    private readonly paymentService: PaymentService,
    private readonly restaurantUsersService: RestaurantUsersService,
  ) {}

  async getAllCompletedOrders(user: JWTUser) {
    const restaurantUser = await this.restaurantUsersService.getIAMUserRestaurantId(
      {
        IAMUserId: user.IAMUserId,
      },
    );
    if (!restaurantUser)
      throw new HttpException("Invalid user. Couldn't add the category", 400);

    return await this.ordersModel
      .find({
        restaurantId: restaurantUser.restaurantId,
        paymentStatus: PAYMENT_STATUSES.COMPLETED,
        isActive: true,
        isDeleted: false,
      })
      .populate('sessionDetails')
      .populate('branchDetails', 'name');
  }

  async create(
    restaurantId: string,
    branchId: string,
    createOrderDto: CreateOrderDto,
  ) {
    const sessionDetails = await this.orderSessionsModel.create({
      restaurantId: Types.ObjectId(restaurantId),
      branchId: Types.ObjectId(branchId),
      customerName: createOrderDto.customerName,
      customerEmail: createOrderDto.customerEmail,
      customerAddress: createOrderDto.customerAddress,
    });

    let orderedItems = JSON.parse(createOrderDto.cartItems);
    let totalPrice = 0;
    let isAllCatalogueAvailable = true;
    orderedItems = await Promise.all(
      orderedItems.map(async (item) => {
        const catalogueDetails = await this.catalogueService.getCatalogueDetails(
          item.foodItemId,
        );
        if (!catalogueDetails.isAvailable) isAllCatalogueAvailable = false;
        totalPrice += item.quantity * catalogueDetails.salePrice;
        return {
          catalogueId: item.foodItemId,
          name: catalogueDetails.name,
          originalPrice: catalogueDetails.originalPrice,
          salePrice: catalogueDetails.salePrice,
          quantity: item.quantity,
          totalPrice: item.quantity * catalogueDetails.salePrice,
        };
      }),
    );

    if (!isAllCatalogueAvailable)
      throw new HttpException('Some of the food items is not available', 400);

    if (totalPrice !== createOrderDto.finalPrice)
      throw new HttpException(
        'Some of the food items price has been changed. Please refresh and try again',
        400,
      );

    const order = await this.ordersModel.create({
      sessionId: sessionDetails._id,
      restaurantId: Types.ObjectId(restaurantId),
      branchId: Types.ObjectId(branchId),
      items: orderedItems,
      finalPrice: totalPrice,
    });

    console.log({ orderedItems, totalPrice });
    return {
      sessionDetails,
      orderDetails: order,
    };
  }

  async addNewItemsToOrder(
    restaurantId: string,
    branchId: string,
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ) {
    const orderDetails = await this.ordersModel.findOne({
      _id: Types.ObjectId(orderId),
    });
    if (!orderDetails) throw new HttpException('Invalid order', 400);

    const sessionDetails = await this.orderSessionsModel.findOne({
      _id: orderDetails.sessionId,
    });
    if (!sessionDetails)
      throw new HttpException("Order session doesn't exist", 400);

    if (sessionDetails.status === ORDER_SESSION_TYPES.COMPLETED)
      throw new HttpException('This session is already completed', 400);

    let orderedItems = JSON.parse(updateOrderDto.cartItems);
    let totalPrice = 0;
    let isAllCatalogueAvailable = true;
    orderedItems = await Promise.all(
      orderedItems.map(async (item) => {
        const catalogueDetails = await this.catalogueService.getCatalogueDetails(
          item.foodItemId,
        );
        if (!catalogueDetails.isAvailable) isAllCatalogueAvailable = false;
        totalPrice += item.quantity * catalogueDetails.salePrice;
        return {
          catalogueId: item.foodItemId,
          name: catalogueDetails.name,
          originalPrice: catalogueDetails.originalPrice,
          salePrice: catalogueDetails.salePrice,
          quantity: item.quantity,
          totalPrice: item.quantity * catalogueDetails.salePrice,
        };
      }),
    );

    if (!isAllCatalogueAvailable)
      throw new HttpException('Some of the food items is not available', 400);

    if (totalPrice !== updateOrderDto.finalPrice)
      throw new HttpException(
        'Some of the food items price has been changed. Please refresh and try again',
        400,
      );

    orderDetails.items = [...orderDetails.items, ...orderedItems];
    orderDetails.finalPrice = orderDetails.finalPrice + totalPrice;

    await orderDetails.save();

    return {
      sessionDetails: sessionDetails,
      orderDetails: orderDetails,
    };
  }

  async initiatePayment(orderId: string) {
    const orderDetails = await this.ordersModel.findOne({
      _id: Types.ObjectId(orderId),
    });
    const sessionDetails = await this.orderSessionsModel.findOne({
      _id: orderDetails.sessionId,
    });
    // if (sessionDetails.status !== ORDER_SESSION_TYPES.APPROVED)
    //   throw new HttpException(
    //     "Couldn't make payment. This session is not approved by restaurant",
    //     400,
    //   );

    if (orderDetails.paymentStatus === PAYMENT_STATUSES.COMPLETED)
      throw new HttpException('Payment already made', 400);

    const paymentOrder = await this.paymentService.createOrder({
      orderId: orderDetails._id.toHexString(),
      amount: orderDetails.finalPrice,
    });

    orderDetails.paymentOrderId = paymentOrder.id;
    orderDetails.save();

    return orderDetails;
  }

  async completePayment(
    orderId: string,
    completePaymentDto: CompletePaymentDto,
  ) {
    const orderDetails = await this.ordersModel.findOne({
      _id: Types.ObjectId(orderId),
    });
    const sessionDetails = await this.orderSessionsModel.findOne({
      _id: orderDetails.sessionId,
    });
    // if (sessionDetails.status !== ORDER_SESSION_TYPES.APPROVED)
    //   throw new HttpException(
    //     "Couldn't make payment. This session is not approved by restaurant",
    //     400,
    //   );

    if (orderDetails.paymentStatus === PAYMENT_STATUSES.COMPLETED)
      throw new HttpException('Payment already made', 400);

    orderDetails.paymentStatus = PAYMENT_STATUSES.COMPLETED;
    orderDetails.paymentMode = PAYMENT_MODES.ONLINE;
    orderDetails.paymentReference = {
      razorpayOrderId: completePaymentDto.razorpayOrderId,
      razorpayPaymentId: completePaymentDto.razorpayPaymentId,
      razorpaySignature: completePaymentDto.razorpayOrderId,
    };
    orderDetails.save();

    sessionDetails.status = ORDER_SESSION_TYPES.COMPLETED;
    sessionDetails.save();

    return orderDetails;
  }

  async getAllPendingSessions(user: JWTUser) {
    const restaurantUser = await this.restaurantUsersService.getIAMUserRestaurantId(
      {
        IAMUserId: user.IAMUserId,
      },
    );
    if (!restaurantUser)
      throw new HttpException("Invalid user. Couldn't add the category", 400);

    return this.orderSessionsModel
      .find({
        restaurantId: restaurantUser.restaurantId,
        isActive: true,
        isDeleted: false,
        status: ORDER_SESSION_TYPES.CREATED,
      })
      .populate('branchDetails', 'name');
  }

  async approveSession(sessionId: string, user: JWTUser) {
    const restaurantUser = await this.restaurantUsersService.getIAMUserRestaurantId(
      {
        IAMUserId: user.IAMUserId,
      },
    );
    if (!restaurantUser)
      throw new HttpException("Invalid user. Couldn't add the category", 400);

    const session = await this.orderSessionsModel.findOne({
      _id: Types.ObjectId(sessionId),
      restaurantId: restaurantUser.restaurantId,
      isActive: true,
      isDeleted: false,
      status: ORDER_SESSION_TYPES.CREATED,
    });

    if (!session)
      throw new HttpException('This session not available now', 400);

    session.status = ORDER_SESSION_TYPES.APPROVED;
    await session.save();
    return session;
  }

  async rejectSession(sessionId: string, user: JWTUser) {
    const restaurantUser = await this.restaurantUsersService.getIAMUserRestaurantId(
      {
        IAMUserId: user.IAMUserId,
      },
    );
    if (!restaurantUser)
      throw new HttpException("Invalid user. Couldn't add the category", 400);

    const session = await this.orderSessionsModel.findOne({
      _id: Types.ObjectId(sessionId),
      restaurantId: restaurantUser.restaurantId,
      isActive: true,
      isDeleted: false,
      status: ORDER_SESSION_TYPES.CREATED,
    });

    if (!session)
      throw new HttpException('This session not available now', 400);

    session.status = ORDER_SESSION_TYPES.REJECTED;
    await session.save();
    return session;
  }
}
