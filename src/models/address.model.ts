import mongoose, { Model } from 'mongoose';

import { Address } from 'lib/interfaces/models';

const schema = mongoose.Schema;

const AddressSchema = new schema<Address, Model<Address>>({
  streetName: String,
  district: String,
  province: String,
  state: String,
  postalCode: String,
  isCountryCode: String,
});

export default AddressSchema;
