import bcrypt from 'bcryptjs';
import mongoose, { Model } from 'mongoose';
import { User } from 'lib/interfaces/models';
import UserRoles from 'lib/enums/userRoles.enums';

const schema = mongoose.Schema;

const userSchema = new schema<User, Model<User>>(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    organization: { type: schema.Types.ObjectId, ref: 'Organization' },
    passwordHash: { type: String },
    salt: { type: String },
    role: {
      type: String,
      enum: { values: Object.values(UserRoles), message: '{VALUE} is not supported' },
    },
    active: { type: Boolean },
    activeTill: { type: Date },
    oneTimePassword: { type: [String] },
    isPreUser: Boolean,
  },
  {
    timestamps: true,
  },
);

userSchema.index({ email: 1, role: 1 }, { unique: true });

const User = mongoose.model('user', userSchema);

export default User;
