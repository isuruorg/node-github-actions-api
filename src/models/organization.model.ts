import mongoose, { Schema, Document, Model, model } from 'mongoose';
import { Organization } from 'lib/interfaces/models';

const schema = mongoose.Schema;

const organizationSchema = new schema<Organization, Model<Organization>>(
  {
    name: { type: String, required: true },
    email: { type: String },
    accessibleChains: { type: [String], default: [] },
    creator: { type: schema.Types.ObjectId, ref: 'User', immutable: true },
    editor: { type: schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

organizationSchema.index({ name: 1 }, { unique: true });
const Organization = mongoose.model('Organization', organizationSchema);
export default Organization;
