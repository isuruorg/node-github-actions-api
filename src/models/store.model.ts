import mongoose, { Model } from 'mongoose';

import { Store } from 'lib/interfaces/models';
import AddressSchema from 'models/address.model';
import GeoCodeSchema from 'models/geoCode.model';
import { GeoCodeTypes } from 'lib/enums/store.enum';
const schema = mongoose.Schema;

const storeSchema = new schema<Store, Model<Store>>(
  {
    chain: String,
    store: String,
    host: String,

    address: String,
    fullAddress: { type: AddressSchema },
    postalCode: String,
    email: String,
    phone: [String],
    fax: [String],
    operatingHours: {},
    openStatus: String,
    category: String,
    parkingLot: { type: Boolean, default: false },
    placeKey: String,
    traceclawPlaceId: String,
    location: String,
    topCategory: String,
    subCategory: String,
    naicsCode: Number,
    polygonWkt: [],
    polygonClass: String,
    buildingHeight: String,
    enclosed: Boolean,
    categoryTags: [],
    trackingOpenedSince: String,
    trackingClosedSince: String,
    isoCountryCode: String,
    parentPlacekey: String,
    parentTraceclawPlaceId: String,
    userLocationId: String,
    poi_id: Number,
    lat: Number,
    lon: Number,

    // geo code
    geoCode: {
      type: GeoCodeSchema,
      default: { [GeoCodeTypes.General]: null, [GeoCodeTypes.Parking]: null },
    },
    geoCodeAddedAt: { type: Date, immutable: true },
    geoCodeUpdatedAt: Date,
    geoCodeCreator: { type: schema.Types.ObjectId, ref: 'User' }, //  person who added geocode

    // datamart
    isDataMart: { type: Boolean, default: false }, // is converted to datamart
    convertedToDataMartAt: Date,
    dataMartCreator: { type: schema.Types.ObjectId, ref: 'User' }, //person who converted to data mart
    traceclawBrandIds: [{ type: schema.Types.ObjectId, ref: 'Brand' }],

    // reporting
    assigned: { type: Boolean, default: false }, // assigned for a Data entry
    isCompleted: { type: Boolean, default: false }, // completed marking store details
    geoCodeAccepted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

storeSchema.index({ store: 1, chain: 1, address: 1 }, { unique: true });
export default mongoose.model('Store', storeSchema);
