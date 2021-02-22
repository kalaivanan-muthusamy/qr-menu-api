import { Schema, Document } from 'mongoose';

export const ModuleActionsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

export const IAMModulesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    actions: {
      type: [ModuleActionsSchema],
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

export interface ModuleActions {
  name: string;
  key: string;
  description: string;
}

export interface IAMModulesModel extends Document {
  name: string;
  key: string;
  description: string;
  actions: ModuleActions;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
