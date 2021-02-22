import { Schema, Document } from 'mongoose';

export const RestaurantsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
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
    toJSON: {
      virtuals: true,
    },
  },
);

export interface RestaurantsModel extends Document {
  name: string;
  description: string;
  address: string;
  isActive?: boolean;
  isDeleted?: boolean;
}
