import mongoose, { Model } from 'mongoose';
import { Counter } from 'lib/interfaces/models';

const schema = mongoose.Schema;

const CounterSchema = new schema<Counter, Model<Counter>>({
  type: { type: String, required: true },
  seq: { type: Number, default: 100000 },
});

export default mongoose.model('Counter', CounterSchema);
