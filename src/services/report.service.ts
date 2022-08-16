import dayjs from 'dayjs';

import {
  NORMAL_REPORT_HEADERS,
  POLYGON_MARKING_SUMMARY_REPORT_HEADERS,
  POLYGON_MARKING_DETAIL_REPORT_HEADERS,
} from 'lib/utils/report.utils';
import serviceHandler from 'middlewares/handlers/serviceResponseHandler';
import storeModel from 'models/store.model';
import { YYYY_MM_DD_FORMAT_DASH, HH_mm } from 'lib/utils/time.utils';

const getNormalPolygonReport = async (
  startDate: string = dayjs().subtract(1, 'year').format(),
  endDate: string = dayjs().format(),
  chain?: string,
  userId?: string,
) => {
  try {
    const query = {};
    if (chain) {
      query['chain'] = chain;
    }
    if (userId) {
      query['geoCodeCreator'] = userId;
    }

    query['geoCodeUpdatedAt'] = {
      $gte: dayjs(startDate).startOf('day').toDate(),
      $lt: dayjs(endDate).endOf('day').toDate(),
    };

    const results = await storeModel.find(
      query,
      '_id chain store address geoCode geoCodeCreator geoCodeUpdatedAt',
    );
    return serviceHandler(results, null);
  } catch (error) {
    console.log('error:', error);
    return serviceHandler(null, error);
  }
};

const getPolygonMarkingSummaryReport = async (
  startDate: string = dayjs().subtract(3, 'month').format(),
  endDate: string = dayjs().format(),
  chain?: string,
  userId?: string,
) => {
  try {
    const match = {};
    if (chain) {
      match['chain'] = chain;
    }
    if (userId) {
      match['geoCodeCreator'] = userId;
    }

    if (startDate && endDate) {
      match['geoCodeUpdatedAt'] = {
        $gte: dayjs(startDate).startOf('day').toDate(),
        $lt: dayjs(endDate).endOf('day').toDate(),
      };
    } else if (startDate) {
      match['geoCodeUpdatedAt'] = {
        $gte: dayjs(startDate).startOf('day').toDate(),
      };
    } else if (endDate) {
      match['geoCodeUpdatedAt'] = {
        $lt: dayjs(endDate).endOf('day').toDate(),
      };
    }

    const query = [];

    if (Object.keys(match)?.length) {
      query.push({ $match: match });
    }

    query.push({
      $group: {
        _id: {
          geoCodeCreator: '$geoCodeCreator',
          chain: '$chain',
        },
        count: { $sum: 1 },
      },
    });

    query.push({
      $lookup: {
        from: 'users',
        localField: '_id.geoCodeCreator',
        foreignField: '_id',
        as: 'geoCodeCreator',
      },
    });
    query.push({ $unwind: { path: '$geoCodeCreator' } });
    query.push({ $sort: { '_id.chain': 1 } });
    const results = await storeModel.aggregate(query);
    return serviceHandler(results, null);
  } catch (error) {
    return serviceHandler(null, error);
  }
};

const getPolygonMarkingDetailReport = async (
  startDate: string = dayjs().subtract(3, 'month').format(),
  endDate: string = dayjs().format(),
  chain?: string,
  userId?: string,
) => {
  try {
    const match = { chain: chain };
    if (userId) {
      match['geoCodeCreator'] = userId;
    }

    if (startDate && endDate) {
      match['geoCodeUpdatedAt'] = {
        $gte: dayjs(startDate).startOf('day').toDate(),
        $lt: dayjs(endDate).endOf('day').toDate(),
      };
    } else if (startDate) {
      match['geoCodeUpdatedAt'] = {
        $gte: dayjs(startDate).startOf('day').toDate(),
      };
    } else if (endDate) {
      match['geoCodeUpdatedAt'] = {
        $lt: dayjs(endDate).endOf('day').toDate(),
      };
    }

    const query = [];
    query.push({ $match: match });
    query.push({
      $lookup: {
        from: 'users',
        localField: 'geoCodeCreator',
        foreignField: '_id',
        as: 'geoCodeCreator',
      },
    });
    query.push({ $unwind: { path: '$geoCodeCreator' } });
    query.push({ $sort: { chain: 1 } });

    const results = await storeModel.aggregate(query);
    return serviceHandler(results, null);
  } catch (error) {
    return serviceHandler(null, error);
  }
};

const prepareDataRowsForPolygonMarkingSummaryReport = async (
  rows: object[],
  startDate: string = dayjs().subtract(1, 'year').format(),
  endDate: string = dayjs().format(),
): Promise<object[]> => {
  if (!rows?.length) {
    return [];
  }
  return rows.map((row: any) => ({
    [POLYGON_MARKING_SUMMARY_REPORT_HEADERS[0]]: dayjs(startDate).format(YYYY_MM_DD_FORMAT_DASH),
    [POLYGON_MARKING_SUMMARY_REPORT_HEADERS[1]]: dayjs(endDate).format(YYYY_MM_DD_FORMAT_DASH),
    [POLYGON_MARKING_SUMMARY_REPORT_HEADERS[2]]: row.geoCodeCreator.email,
    [POLYGON_MARKING_SUMMARY_REPORT_HEADERS[3]]: row._id.chain,
    [POLYGON_MARKING_SUMMARY_REPORT_HEADERS[4]]: row.count,
  }));
};

const prepareDataRowsForNormalPolygonReport = async (rows: object[]): Promise<object[]> => {
  if (!rows?.length) {
    return [];
  }
  return rows.map((row: any) => ({
    [NORMAL_REPORT_HEADERS[0]]: row._id,
    [NORMAL_REPORT_HEADERS[1]]: row.chain,
    [NORMAL_REPORT_HEADERS[2]]: row.store,
    [NORMAL_REPORT_HEADERS[3]]: row.address,
    [NORMAL_REPORT_HEADERS[4]]: row.geoCode?.general,
    [NORMAL_REPORT_HEADERS[5]]: row.geoCodeCreator,
    [NORMAL_REPORT_HEADERS[6]]: dayjs(row.geoCodeUpdatedAt).format(YYYY_MM_DD_FORMAT_DASH),
    [NORMAL_REPORT_HEADERS[7]]: dayjs(row.geoCodeUpdatedAt).format(HH_mm),
  }));
};

const prepareDataRowsForPolygonMarkingDetailReport = async (rows: object[]): Promise<object[]> => {
  if (!rows?.length) {
    return [];
  }
  return rows.map((row: any) => ({
    [POLYGON_MARKING_DETAIL_REPORT_HEADERS[0]]: row.chain,
    [POLYGON_MARKING_DETAIL_REPORT_HEADERS[1]]: row.store,
    [POLYGON_MARKING_DETAIL_REPORT_HEADERS[2]]: row.address,
    [POLYGON_MARKING_DETAIL_REPORT_HEADERS[3]]: row.geoCodeCreator.email,
    [POLYGON_MARKING_DETAIL_REPORT_HEADERS[4]]: dayjs(row.geoCodeUpdatedAt).format(
      YYYY_MM_DD_FORMAT_DASH,
    ),
    [POLYGON_MARKING_DETAIL_REPORT_HEADERS[5]]: dayjs(row.geoCodeUpdatedAt).format(HH_mm),
  }));
};

export = {
  getNormalPolygonReport,
  getPolygonMarkingSummaryReport,
  getPolygonMarkingDetailReport,
  prepareDataRowsForNormalPolygonReport,
  prepareDataRowsForPolygonMarkingSummaryReport,
  prepareDataRowsForPolygonMarkingDetailReport,
};
