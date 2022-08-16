import { applyPrivacyFilter, applyChainsPrivacyFilter } from 'middlewares/handlers/privacyHandler';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from 'lib/utils/store.utils';
import { GeoCodeTypes } from 'lib/enums/store.enum';
import { getMultiStoreObjects, validateStoreUploadCSVHeaders } from 'lib/utils/store.utils';
import { localFileCSVparser } from 'lib/utils/csv.utils';
import { removeFile } from 'lib/utils/file.utils';
import { Store, User } from 'lib/interfaces/models';
import storeModel from 'models/store.model';
import userService from 'services/user.service';
import serviceHandler from 'middlewares/handlers/serviceResponseHandler';
import { Callback } from 'mongoose';
import cheerio from 'cheerio';
import url from 'url';
import axios from 'axios';
import rp from 'request-promise';
import dayjs from 'dayjs';
import moment from 'moment';
import dayjsPluginUTC from 'dayjs-plugin-utc';
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
import { PERMISSION_DENIED_FOR_CHAIN_MSG } from 'lib/utils/commonErrorMsgs.utils';

interface ServiceHandlerProps {
  data: any;
  error: string;
}

const saveStoreCSV = async (fileName: string, callback: CallableFunction) => {
  try {
    localFileCSVparser(fileName, async (err, csvContent: any[]) => {
      if (err) {
        throw new Error(err);
      }
      const missingHeaders = validateStoreUploadCSVHeaders(csvContent);
      if (missingHeaders.length) {
        return callback(`Missing columns - ${missingHeaders.toString()}`, null);
      }
      const [validRows, duplicateRows] = getMultiStoreObjects(csvContent);
      createOrUpdateStores(validRows, (error, createdStores) => {
        callback(error, { created: createdStores, duplicates: duplicateRows });
        removeFile(fileName);
      });
    });
  } catch (error) {
    callback(error, null);
  }
};

const createOrUpdateStores = (stores: Store[], callback: CallableFunction) => {
  try {
    Promise.all(
      stores.map(store => {
        return storeModel.findOneAndUpdate(
          {
            chain: store.chain,
            address: store.address,
          },
          store,
          {
            upsert: true,
            new: true,
          },
        );
      }),
    ).then(createdStores => {
      callback(null, createdStores);
    });
  } catch (error) {
    callback('Issues on fields or duplicate records.', null);
  }
};

const getDisctintChains = async (
  user: User,
  limit: number = DEFAULT_LIMIT,
  skip: number = DEFAULT_SKIP,
) => {
  const chainList = await storeModel.aggregate(await buildQuery(user, limit, skip));
  return chainList;
};

const getDistinctChainsCount = async (user: User): Promise<number> => {
  try {
    return applyPrivacyFilter(user)
      ? (await userService.getUserAccessibleChains(String(user.organization)))?.length
      : (await storeModel.distinct('chain'))?.length;
  } catch (error) {}
};

const getAllStoresByChain = async (
  chain: string = '',
  limit: number = DEFAULT_LIMIT,
  skip: number = DEFAULT_SKIP,
) => {
  try {
    return await storeModel.find({ chain: chain }).skip(skip).limit(limit);
  } catch (error) {
    console.log('error:', error);
  }
};

const getStoreByChainID = async (storeID: string = '') => {
  try {
    return await storeModel.findById(storeID);
  } catch (error) {
    console.log('error getStoreByChainID:', error);
  }
};

const getNextStore = async (user: User, chain: string, skipped: number) => {
  try {
    const isPrivacyEnabled = applyPrivacyFilter(user);
    if (isPrivacyEnabled) {
      const accessibleChains = await userService.getUserAccessibleChains(String(user.organization));
      if (!accessibleChains.includes(chain)) {
        return serviceHandler(null, "User doesn't have access to given chain");
      }
    }
    const store = await storeModel
      .find({
        chain: chain,
        assigend: false,
        isCompleted: false,
        geoCodeAccepted: false,
        isDataMart: false,
      })
      .sort({ _id: 1 })
      .skip(skipped)
      .limit(1);

    if (store.length === 1) {
      const gps = await getGPSInfoFromAddressRP(store[0]?.address);
      return serviceHandler({ store: store[0], gps: gps }, null);
    }
    // return serviceHandler([], null);
  } catch (error) {
    return serviceHandler(null, error);
  }
};

const getStoreWithGPS = async (id: string) => {
  try {
    const store = await getStoreByChainID(id);
    const gps = await getGPSInfoFromAddressRP(store?.address);
    return serviceHandler({ store: store, gps: gps }, null);
  } catch (error) {
    return serviceHandler(null, error);
  }
};

const unAllocateStores = async () => {
  try {
    const unAllocated = await storeModel
      .updateMany(
        { assinged: true, isCompleted: false },
        { $set: { assinged: false } },
        { upsert: false, new: true },
      )
      .count();
    return serviceHandler(unAllocated, null);
  } catch (error) {
    return serviceHandler(null, error);
  }
};

const buildQuery = async (user: User, limit: number, skip: number) => {
  const page = (skip - 1) * limit;
  const query: any = [
    applyPrivacyFilter(user)
      ? {
          $match: {
            chain: { $in: await userService.getUserAccessibleChains(String(user.organization)) },
          },
        }
      : { $match: { chain: { $exists: true, $nin: [''] } } },
    {
      $group: {
        _id: { chain: '$chain' },
        brand: { $first: '$brand' },
        count: { $sum: 1 },
        marked: { $sum: { $cond: [{ $eq: ['$isCompleted', true] }, 1, 0] } },
        transferedDataMarts: { $sum: { $cond: [{ $eq: ['$isDataMart', true] }, 1, 0] } },
      },
    },

    {
      $project: {
        _id: 0,
        chain: '$_id.chain',
        brand: 1,
        count: 1,
        marked: 1,
        transferedDataMarts: 1,
        percentage: { $multiply: [{ $divide: ['$marked', '$count'] }, 100] },
        transferedDatamartPercentage: {
          $multiply: [{ $divide: ['$transferedDataMarts', '$count'] }, 100],
        },
      },
    },
    {
      $sort: { ['chain']: 1 },
    },
    {
      $skip: page,
    },
    {
      $limit: limit,
    },
  ];
  return query;
};

const saveGeoCodes = async (storeId: string, geoCodeType: string, geoCode: any, user: User) => {
  if (Object.values(GeoCodeTypes).includes(geoCodeType as unknown as GeoCodeTypes)) {
    const update = {};

    if (geoCodeType === GeoCodeTypes.General) {
      update['geoCode.general'] = geoCode;
    } else {
      update['geoCode.parking'] = geoCode;
    }
    const geoCodeRemoved = geoCode.length === 0;
    update['geoCodeCreator'] = user.id;
    update['assigned'] = !geoCodeRemoved;
    update['isCompleted'] = !geoCodeRemoved;
    update['geoCodeAddedAt'] = new Date();
    update['geoCodeUpdatedAt'] = new Date();
    return await storeModel.findByIdAndUpdate(storeId, { $set: update });
  }
};

const getDataEntryCount = async (
  userId: string,
  startDate: string = dayjs().format(),
  endDate: string = dayjs().format(),
) => {
  try {
    const start = dayjs(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const end = dayjs(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    const data = await storeModel
      .find({
        geoCodeCreator: userId,
        'geoCode.general': { $exists: true },
        geoCodeUpdatedAt: { $gte: start, $lt: end },
      })
      .count();
    return serviceHandler(data, null);
  } catch (error) {
    return serviceHandler(null, error);
  }
};

const getGeoCodesForMarkedStores = async (
  chain: string,
  user: User,
): Promise<ServiceHandlerProps> => {
  try {
    if (await applyChainsPrivacyFilter(user, chain)) {
      return serviceHandler(null, PERMISSION_DENIED_FOR_CHAIN_MSG);
    }
    const data = await storeModel.aggregate([
      {
        $match: {
          chain: chain,
          'geoCode.general': { $exists: true },
        },
      },
      {
        $project: {
          geometry: '$geoCode.general.features.geometry',
          properties: {
            chain: '$chain',
            store: '$store',
            address: '$address',
            host: '$host',
          },
        },
      },
    ]);

    return serviceHandler(data, null);
  } catch (error) {
    return serviceHandler(null, error);
  }
};

const getGPSInfoFromAddressRP = async (address: string) => {
  // const result = axios.post('https://www.google.com/maps/search/' + address);

  let options = {
    // https://www.google.com/maps/search/?api=1&query=110-15 Sage Hill Ct NwCalgaryT3R 0S4
    uri: 'https://www.google.com/maps/search/',
    qs: {
      api: 1,
      query: address,
    },
    headers: {
      'User-Agent': 'Request-Promise',
    },
  };
  return rp(options)
    .then(function (repos) {
      const $ = cheerio.load(repos);
      // con ole lo ('U er ha  %d re os'  re os. eng h)
      let coordinates;
      $('meta').each((i, node) => {
        if (node.attribs.content.startsWith('https://maps.google.com')) {
          coordinates = url.parse(node.attribs.content, true).query.center;
          return false;
        }
      });
      return coordinates;
    })
    .catch(function (err) {
      return null;
    });
};

export = {
  saveStoreCSV,
  getDisctintChains,
  getDistinctChainsCount,
  getAllStoresByChain,
  getStoreByChainID,
  saveGeoCodes,
  getStoreWithGPS,
  getNextStore,
  getGPSInfoFromAddressRP,
  getDataEntryCount,
  unAllocateStores,
  getGeoCodesForMarkedStores,
};
