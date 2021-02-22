import { Schema, Document, Types } from 'mongoose';

export const RestaurantUsersSchema = new Schema(
  {
    IAMUserId: {
      type: Types.ObjectId,
      required: true,
    },
    restaurantId: {
      type: Types.ObjectId,
      required: true,
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
  },
);

export interface RestaurantUsersModel extends Document {
  IAMUserId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  isActive?: boolean;
  isDeleted?: boolean;
}
