import { Injectable } from '@nestjs/common';
import * as Razorpay from 'razorpay';

const razorpayInstance = new Razorpay({
  key_id: 'rzp_test_XOzOb2btILyEMf',
  key_secret: 'L6c20hUodXLdBGlWayFW4ucl',
});

@Injectable()
export class PaymentService {
  constructor() {}

  async createOrder({ orderId, amount }) {
    const options = {
      amount, // amount in the smallest currency unit
      currency: 'INR',
      receipt: orderId,
    };
    const paymentOrderId = await razorpayInstance.orders.create(options);
    console.log(paymentOrderId);
    return paymentOrderId;
  }
}
