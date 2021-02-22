import { Schema, Types, Document } from 'mongoose';
import { ORDER_SESSION_TYPES } from './../orders.constants';

export const OrderSessionsSchema = new Schema(
  {
    restaurantId: {
      type: Types.ObjectId,
      required: true,
    },
    branchId: {
      type: Types.ObjectId,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(ORDER_SESSION_TYPES),
      default: ORDER_SESSION_TYPES.CREATED,
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
OrderSessionsSchema.virtual('branchDetails', {
  ref: 'branches',
  localField: 'branchId',
  foreignField: '_id',
  justOne: true,
});

export interface OrderSessionsModel extends Document {
  restaurantId: Types.ObjectId;
  branchId: Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  status?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}
