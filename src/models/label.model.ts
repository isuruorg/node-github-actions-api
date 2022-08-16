import mongoose, { Model } from 'mongoose';

import { Label } from 'lib/interfaces/models';

const schema = mongoose.Schema;

const labelSchema = new schema<Label, Model<Label>>(
  {
    name: { type: String, required: true },
    creator: { type: schema.Types.ObjectId, ref: 'user', immutable: true },
    lastUpdater: { type: schema.Types.ObjectId, ref: 'user' },
    jobs: [{ type: schema.Types.ObjectId, ref: 'Job' }],
  },
  { timestamps: true },
);

export default mongoose.model('Label', labelSchema);
