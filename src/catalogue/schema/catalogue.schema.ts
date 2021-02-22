import { Schema, Document, Types } from 'mongoose';

export const CatalogueSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
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
    isAvailable: {
      type: Boolean,
      required: true,
    },
    categoryId: {
      type: Types.ObjectId,
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

export interface CatalogueModel extends Document {
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  categoryId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  isAvailable: boolean;
  branchIds: Types.ObjectId[];
  isActive?: boolean;
  isDeleted?: boolean;
}
