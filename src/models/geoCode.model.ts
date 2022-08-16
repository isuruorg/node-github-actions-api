import mongoose, { Model } from 'mongoose';

import { Feature, FeatureCollection, GeoCode, Geometry } from 'lib/interfaces/models';
import { GeoCodeTypes } from 'lib/enums/store.enum';

const schema = mongoose.Schema;

const Geometry = new schema<Geometry, Model<Geometry>>({
  cordinates: [],
  type: String,
});

const Feature = new schema<Feature, Model<Feature>>({
  id: String,
  type: String,
  geometry: { type: Geometry },
});

const FeatureCollectionSchema = new schema<FeatureCollection, Model<FeatureCollection>>({
  type: String,
  features: [Feature],
});

const GeoCodeSchema = new schema<GeoCode, Model<GeoCode>>({
  [GeoCodeTypes.General]: { type: FeatureCollectionSchema },
  [GeoCodeTypes.Parking]: { type: FeatureCollectionSchema },
});

export default GeoCodeSchema;
