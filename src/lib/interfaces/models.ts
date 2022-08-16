import { Types } from 'mongoose';

import { GeoCodeTypes } from 'lib/enums/store.enum';
import { Status, StorageTypes } from 'lib/enums/job.enum';
import UserRoles from 'lib/enums/userRoles.enums';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  organization: Types.ObjectId;
  passwordHash?: string;
  salt: string;
  role: UserRoles;
  active: boolean;
  activeTill: Date;
  oneTimePassword: String[];
  isPreUser: Date;
}

interface Organization {
  id: Types.ObjectId;
  name: string;
  email: string;
  accessibleChains: string[];
  creator: Types.ObjectId;
  editor: Types.ObjectId;
}

interface Counter {
  type: string;
  seq: number;
}

interface DataMart {
  chain: [string];
  storeName: string;
  address: string;
  parkingLot: number;
  polygonData: object;
  contactInfo: [];
  operatingHours: [object];
  allocated: boolean;
  geoCodeAccepted: boolean;
  openStatus: string;
  postalCode: string;
  category: string;
  placeKey: string;
  safegraphPlaceId: string;
  locationName: string;
  safegraphBrandIds: [];
  topCategory: string;
  subCategory: string;
  naicsCode: number;
  polygonWkt: string;
  polygonClass: string;
  buildingHeight: string;
  enclosed: boolean;
  categoryTags: [];
  trackingOpenedSince: string;
  trackingClosedSince: string;
  isoCountryCode: string;
  parentPlacekey: string;
  parentSafegraphPlaceId: string;
  userLocationId: string;
  updated: boolean;
  poi_id: number;
  lat: number;
  lon: number;
}

interface Job {
  jobId: string;
  jobName: string;
  creator: Types.ObjectId;
  updater: Types.ObjectId;
  organizations: [Types.ObjectId];
  images: string[];
  status: Status;
  labels: Types.ObjectId;
  storageType: StorageTypes;
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  connectionEstablish: boolean;
}

interface Label {
  name: string;
  creator: Types.ObjectId;
  lastUpdater: Types.ObjectId;
  jobs: [Types.ObjectId];
}

interface NaicsCode {
  code: string;
  title: string;
}

interface Store {
  _id: string;
  chain: string;
  store: string;
  host: string;
  address: string;
  fullAddress: Address;
  postalCode: string;
  email: string;
  phone: [string];
  fax: [string];
  operatingHours: [];
  openStatus: string;
  category: string;
  parkingLot: boolean;
  placeKey: string;
  traceclawPlaceId: string;
  location: string;

  topCategory: string;
  subCategory: string;
  naicsCode: number;
  polygonWkt: object;
  polygonClass: string;
  buildingHeight: string;
  enclosed: boolean;
  categoryTags: [];
  trackingOpenedSince: string;
  trackingClosedSince: string;
  isoCountryCode: string;
  parentPlacekey: string;
  parentTraceclawPlaceId: string;
  userLocationId: string;

  poi_id: number;
  lat: number;
  lon: number;

  assigned: boolean;
  isCompleted: boolean;
  geoCodeAccepted: boolean;

  geoCode: {};
  geoCodeCreator: Types.ObjectId;
  geoCodeAddedAt: Date;
  geoCodeUpdatedAt: Date;

  isDataMart: boolean;
  dataMartCreator: Types.ObjectId;
  convertedToDataMartAt: Date;
  traceclawBrandIds: [[Types.ObjectId]];
}

interface Brand {
  name: string;
  isParent: boolean;
  parent: Types.ObjectId;
}

interface Address {
  streetName: string;
  district: string;
  province: string;
  state: string;
  postalCode: string;
  isCountryCode: string;
}

interface FeatureCollection {
  type: string;
  features: {
    id: string;
    type: string;
    geometry: {
      cordinates: [];
      type: string;
    };
  };
}

interface GeoCode {
  [GeoCodeTypes.General]: FeatureCollection;
  [GeoCodeTypes.Parking]: FeatureCollection;
}

interface Geometry {
  cordinates: [];
  type: string;
}

interface Feature {
  id: string;
  type: string;
  geometry: Geometry;
}

export {
  Address,
  Brand,
  Counter,
  DataMart,
  Feature,
  FeatureCollection,
  GeoCode,
  Geometry,
  Job,
  Label,
  NaicsCode,
  Organization,
  Store,
  User,
};
