import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  SetMetadata,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CompletePaymentDto } from './dto/complete-payment.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './../auth/gaurds/jwt-auth.guard';
import { PermissionsGuard } from './../auth/gaurds/permissions.guard';
import { JWTUser } from 'src/common/interfaces/JWTUser';

@Controller('orders')
@ApiBearerAuth()
@SetMetadata('MODULE', 'ORDERS')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @SetMetadata('ACTION', ['VIEW_ALL_ORDERS'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async getAllCompletedOrders(@Request() req) {
    try {
      const user = <JWTUser>req.user;
      return this.ordersService.getAllCompletedOrders(user);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('initiate-payment/:orderId')
  async initiatePayment(@Param('orderId') orderId: string) {
    try {
      return this.ordersService.initiatePayment(orderId);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('complete-payment/:orderId')
  async completePayment(
    @Param('orderId') orderId: string,
    @Body() completePaymentDto: CompletePaymentDto,
  ) {
    try {
      return this.ordersService.completePayment(orderId, completePaymentDto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('sessions/approve/:sessionId')
  @SetMetadata('ACTION', ['APPROVE_SESSION'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async approveSession(@Param('sessionId') sessionId: string, @Request() req) {
    try {
      const user = <JWTUser>req.user;
      return this.ordersService.approveSession(sessionId, user);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post('sessions/reject/:sessionId')
  @SetMetadata('ACTION', ['REJECT_SESSION'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async rejectSession(@Param('sessionId') sessionId: string, @Request() req) {
    try {
      const user = <JWTUser>req.user;
      return this.ordersService.rejectSession(sessionId, user);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Post(':restaurantId/:branchId')
  async create(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    try {
      return this.ordersService.create(restaurantId, branchId, createOrderDto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Put(':restaurantId/:branchId/:orderId')
  async addNewItemsToOrder(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    try {
      return this.ordersService.addNewItemsToOrder(
        restaurantId,
        branchId,
        orderId,
        updateOrderDto,
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Get('sessions/pending')
  @SetMetadata('ACTION', ['VIEW_ALL_PENDING_SESSIONS'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async getAllPendingSessions(@Request() req) {
    try {
      const user = <JWTUser>req.user;
      return this.ordersService.getAllPendingSessions(user);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
