import mongoose, { Model } from 'mongoose';

import Counter from 'models/counter.model';
import { Job } from 'lib/interfaces/models';
import { Status, StorageTypes } from 'lib/enums/job.enum';

const schema = mongoose.Schema;

const jobSchema = new schema<Job, Model<Job>>(
  {
    jobId: { type: String },
    jobName: { type: String },
    creator: { type: schema.Types.ObjectId, ref: 'User', immutable: true },
    updater: { type: schema.Types.ObjectId, ref: 'User' },
    organizations: [{ type: schema.Types.ObjectId, ref: 'Organization' }],
    images: { type: [String], default: [] },
    status: {
      type: String,
      default: Status.Active,
      enum: { values: Object.values(Status), message: '{VALUE} is not supported' },
    },
    labels: [{ type: schema.Types.ObjectId, ref: 'Label' }],
    // storage related
    storageType: {
      type: String,
      required: true,
      enum: { values: Object.values(StorageTypes), message: '{VALUE} is not supported' },
    },
    bucket: { type: String, required: true },
    region: { type: String, required: true },
    accessKeyId: { type: String, required: true },
    secretAccessKey: { type: String, required: true },
    connectionEstablish: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

jobSchema.pre('save', next => {
  const doc: Job = this;
  Counter.findOneAndUpdate({ type: 'job' }, { $inc: { seq: 1 } }, (error, counter) => {
    if (error) {
      return next(error);
    }
    doc.jobId = counter.seq;
    next();
  });
});

export default mongoose.model('Job', jobSchema);
