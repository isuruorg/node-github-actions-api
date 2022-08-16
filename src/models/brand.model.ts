import mongoose, { Model } from 'mongoose';

import { Brand } from 'lib/interfaces/models';

const schema = mongoose.Schema;

const brand = new schema<Brand, Model<Brand>>(
  {
    name: { required: true, type: String },
    isParent: { required: true, type: Boolean },
    parent: { type: schema.Types.ObjectId, ref: 'Brand' },
  },
  { timestamps: true },
);

brand.index({ name: 1, isParent: 1 }, { unique: true });
export default mongoose.model('Brand', brand);
