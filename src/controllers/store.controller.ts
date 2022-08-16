import { NextFunction, Request, Response } from 'express';
import path from 'path';

import responseHandler from 'middlewares/handlers/responseHandler';
import StoreService from 'services/store.service';
import { User } from 'lib/interfaces/models';
import UserModel from 'models/user.model';
import userService from 'services/user.service';
import { verifyJwtToken } from 'lib/utils/jwt.utils';
import dayjs from 'dayjs';

const createStores = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (path.extname(req.file.filename) !== '.csv') {
      next('Only csv files accepted');
    }
    StoreService.saveStoreCSV(req.file.filename, (err, data) => {
      if (err) {
        return next(err);
      }
      responseHandler(res, data);
    });
  } catch (error) {
    next(error);
  }
};

const getChainList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, skip } = req.query;
    const user: User | string = await userService.getUserFromToken(verifyJwtToken(req, next));
    if (user instanceof UserModel) {
      return responseHandler(res, {
        chains: await StoreService.getDisctintChains(user, Number(limit), Number(skip)),
        totalChains: await StoreService.getDistinctChainsCount(user),
      });
    }
    return next(user);
  } catch (error) {
    next(error);
  }
};

const getAllStoresByChain = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, skip } = req.query;
    const { chain } = req.params;
    responseHandler(res, await StoreService.getAllStoresByChain(String(chain), 1000, 1));
  } catch (error) {
    next(error);
  }
};

const getStoreByChainID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { storeID } = req.params;
    responseHandler(res, await StoreService.getStoreByChainID(String(storeID)));
  } catch (error) {
    next(error);
  }
};

const getStoreWithGPS = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    return responseHandler(res, await StoreService.getStoreWithGPS(id));
  } catch (error) {
    next(error);
  }
};

const getNextStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chain, skipped } = req.body;
    const user: User | string = await userService.getUserFromToken(verifyJwtToken(req, next));
    if (user instanceof UserModel) {
      const { data, error } = await StoreService.getNextStore(user, chain, parseInt(skipped));
      if (error) {
        return next(error);
      }
      return responseHandler(res, data);
    }
  } catch (error) {
    console.log('error:', error);
    return next(error);
  }
};

const saveGeoCodes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | string = await userService.getUserFromToken(verifyJwtToken(req, next));
    if (user instanceof UserModel) {
      const { storeId, geoCodeType, geoCode } = req.body;
      return responseHandler(
        res,
        await StoreService.saveGeoCodes(storeId, geoCodeType, geoCode, user),
      );
    }
    return next(user);
  } catch (error) {
    next(error);
  }
};

const getDataEntryCounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | string = await userService.getUserFromToken(verifyJwtToken(req, next));
    if (user instanceof UserModel) {
      const { data, error } = await StoreService.getDataEntryCount(user.id);
      if (error) return next(error);
      return responseHandler(res, data);
    }
    return next(user);
  } catch (error) {
    return next(error);
  }
};

const unAllocatedStores = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await StoreService.unAllocateStores();
    if (error) return next(error);
    return responseHandler(res, data);
  } catch (error) {
    return next(error);
  }
};

const getGeoCodesForMarkedStores = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | string = await userService.getUserFromToken(verifyJwtToken(req, next));
    if (user instanceof UserModel) {
      const { chain } = req.body;
      const { data, error } = await StoreService.getGeoCodesForMarkedStores(chain, user);
      if (error) return next(error);
      if (data?.length === 0) {
        return next(`${chain} does not contain any marked geoCode data`);
      }

      res.header('Content-Type', 'text/csv');
      res.attachment(`${chain}-marked_geoCode-${dayjs().format('YYYY-MM-DD_HH:mm:ss')}.json`);
      return res.send(data);
    }
  } catch (error) {
    next(error);
  }
};

const getTotalChainsCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | string = await userService.getUserFromToken(verifyJwtToken(req, next));
    if (user instanceof UserModel) {
      return responseHandler(res, await StoreService.getDistinctChainsCount(user));
    }
    return next(user);
  } catch (error) {
    return next(error);
  }
};

export = {
  createStores,
  getChainList,
  getAllStoresByChain,
  saveGeoCodes,
  getStoreByChainID,
  getNextStore,
  getStoreWithGPS,
  getDataEntryCounts,
  unAllocatedStores,
  getGeoCodesForMarkedStores,
  getTotalChainsCount,
};
