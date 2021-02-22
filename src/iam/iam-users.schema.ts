import { Schema, Document, Types } from 'mongoose';

export const IAMUsersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roleId: {
      type: Types.ObjectId,
      required: true,
    },
    country: {
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

IAMUsersSchema.virtual('roleDetails', {
  ref: 'iam-roles',
  localField: 'roleId',
  foreignField: '_id',
  justOne: true,
});

export interface IAMUsersModel extends Document {
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
  country: string;
  roleId: Types.ObjectId;
  isActive?: boolean;
  isDeleted?: boolean;
}
