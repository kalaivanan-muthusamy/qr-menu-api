import { Schema, Document, Types } from 'mongoose';

export const BranchesSchema = new Schema(
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

export interface BranchesModel extends Document {
  name: string;
  description: string;
  address: string;
  restaurantId: Types.ObjectId;
  isActive?: boolean;
  isDeleted?: boolean;
}
