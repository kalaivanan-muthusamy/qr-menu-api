import { Schema, Document, Types } from 'mongoose';

export const CategoriesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    restaurantId: {
      type: Types.ObjectId,
      required: true,
    },
    branchIds: {
      type: [Types.ObjectId],
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

export interface CategoriesModel extends Document {
  name: string;
  description: string;
  restaurantId: Types.ObjectId;
  branchIds?: Types.ObjectId[];
  isActive?: boolean;
  isDeleted?: boolean;
}
