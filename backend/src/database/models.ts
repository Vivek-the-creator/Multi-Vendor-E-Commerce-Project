import mongoose, { Schema, model, type InferSchemaType, type Model, type Types } from 'mongoose';

const timestamps = { timestamps: true, versionKey: false as const };

const permissionSchema = new Schema(
  {
    module: { type: String, required: true, trim: true },
    action: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true }
  },
  timestamps
);

permissionSchema.index({ module: 1, action: 1 });

const roleSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    isSystem: { type: Boolean, default: false },
    permissionIds: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
  },
  timestamps
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, trim: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'],
      default: 'PENDING_VERIFICATION'
    },
    emailVerifiedAt: { type: Date },
    tokenVersion: { type: Number, default: 0 },
    deletedAt: { type: Date },
    roleIds: [{ type: Schema.Types.ObjectId, ref: 'Role' }]
  },
  timestamps
);

userSchema.index({ status: 1 });
userSchema.index({ createdAt: 1 });

const orderStatusSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    sortOrder: { type: Number, default: 0 },
    isInitial: { type: Boolean, default: false },
    isTerminal: { type: Boolean, default: false }
  },
  timestamps
);

const commissionRuleSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    rate: { type: Number, required: true },
    storeId: { type: Schema.Types.ObjectId },
    categoryId: { type: Schema.Types.ObjectId },
    isGlobal: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    priority: { type: Number, default: 0 }
  },
  timestamps
);

commissionRuleSchema.index({ storeId: 1, categoryId: 1, isGlobal: 1, isActive: 1 });

const settingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: Schema.Types.Mixed, required: true },
    group: { type: String, required: true, trim: true },
    isPublic: { type: Boolean, default: false }
  },
  timestamps
);

settingSchema.index({ group: 1, isPublic: 1 });

export type PermissionDocument = InferSchemaType<typeof permissionSchema> & { _id: Types.ObjectId };
export type RoleDocument = InferSchemaType<typeof roleSchema> & { _id: Types.ObjectId };
export type UserDocument = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId };

export const Permission: Model<PermissionDocument> =
  (mongoose.models.Permission as Model<PermissionDocument>) ?? model<PermissionDocument>('Permission', permissionSchema);
export const Role: Model<RoleDocument> =
  (mongoose.models.Role as Model<RoleDocument>) ?? model<RoleDocument>('Role', roleSchema);
export const User: Model<UserDocument> =
  (mongoose.models.User as Model<UserDocument>) ?? model<UserDocument>('User', userSchema);
export const OrderStatus: Model<InferSchemaType<typeof orderStatusSchema>> =
  (mongoose.models.OrderStatus as Model<InferSchemaType<typeof orderStatusSchema>>) ??
  model('OrderStatus', orderStatusSchema);
export const CommissionRule: Model<InferSchemaType<typeof commissionRuleSchema>> =
  (mongoose.models.CommissionRule as Model<InferSchemaType<typeof commissionRuleSchema>>) ??
  model('CommissionRule', commissionRuleSchema);
export const Setting: Model<InferSchemaType<typeof settingSchema>> =
  (mongoose.models.Setting as Model<InferSchemaType<typeof settingSchema>>) ?? model('Setting', settingSchema);
