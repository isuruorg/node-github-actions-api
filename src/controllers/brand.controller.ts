import { NextFunction, Request, Response } from 'express';

import brandService from 'services/brand.service';
import responseHandler from 'middlewares/handlers/responseHandler';

const createBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await brandService.createBrand(req.body);
    if (error) {
      return next(error);
    }
    return responseHandler(res, data);
  } catch (error) {
    return next(error);
  }
};

const getBrands = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { parentBrands } = req.query;
    const { data, error } = await brandService.getBrands(parentBrands === 'true');
    if (error) {
      return next(error);
    }
    return responseHandler(res, data);
  } catch (error) {
    return next(error);
  }
};

const editById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const { data, error } = await brandService.editById(id, name);
    if (error) {
      return next(error);
    }
    return responseHandler(res, data);
  } catch (error) {
    return next(error);
  }
};

export = {
  createBrand,
  getBrands,
  editById,
};
