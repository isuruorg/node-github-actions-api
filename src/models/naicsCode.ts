import mongoose, { Model } from 'mongoose';

import { NaicsCode } from 'lib/interfaces/models';

const schema = mongoose.Schema;

const naicsCode = new schema<NaicsCode, Model<NaicsCode>>(
  {
    code: { required: true, type: String },
    title: { required: true, type: String },
  },
  { timestamps: true },
);

export default mongoose.model('NaicsCode', naicsCode);
