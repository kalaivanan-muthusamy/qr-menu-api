import { Schema, Types, Document } from 'mongoose';
import { PAYMENT_MODES, PAYMENT_STATUSES } from './../orders.constants';

const CatalogueItemSchema = new Schema(
  {
    catalogueId: {
      type: Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const PaymentReferenceSchema = new Schema(
  {
    razorpayPaymentId: String,
    razorpayOrderId: String,
    razorpaySignature: String,
  },
  {
    _id: false,
  },
);

export const OrdersSchema = new Schema(
  {
    sessionId: {
      type: Types.ObjectId,
      required: true,
    },
    restaurantId: {
      type: Types.ObjectId,
      required: true,
    },
    branchId: {
      type: Types.ObjectId,
      required: true,
    },
    items: {
      type: [CatalogueItemSchema],
      required: true,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: Object.values(PAYMENT_MODES),
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUSES),
    },
    paymentOrderId: {
      type: String,
    },
    paymentReference: {
      type: PaymentReferenceSchema,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

OrdersSchema.virtual('sessionDetails', {
  ref: 'order-sessions',
  localField: 'sessionId',
  foreignField: '_id',
  justOne: true,
});
OrdersSchema.virtual('branchDetails', {
  ref: 'branches',
  localField: 'branchId',
  foreignField: '_id',
  justOne: true,
});

interface PaymentReference {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface OrdersModel extends Document {
  sessionId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  branchId: Types.ObjectId;
  items: any;
  finalPrice: number;
  paymentMode?: string;
  paymentStatus?: string;
  paymentOrderId?: string;
  paymentReference?: PaymentReference;
}
