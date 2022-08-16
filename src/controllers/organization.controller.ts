import { NextFunction, Request, Response } from 'express';

import organizationService from 'services/organization.service';
import ResponseCodes from 'lib/enums/responseCode.enum';
import responseHandler from 'middlewares/handlers/responseHandler';
import { User } from 'lib/interfaces/models';
import UserModel from 'models/user.model';
import userService from 'services/user.service';
import { verifyJwtToken } from 'lib/utils/jwt.utils';

const createOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | string = await userService.getUserFromToken(verifyJwtToken(req, next));

    if (user instanceof UserModel) {
      return responseHandler(
        res,
        await organizationService.createOrg(req.body, user),
        ResponseCodes.Created,
      );
    }
    return next(user);
  } catch (error) {
    next(error);
  }
};

const updateOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | string = await userService.getUserFromToken(verifyJwtToken(req, next));

    if (user instanceof UserModel) {
      return responseHandler(
        res,
        await organizationService.updateOrgById(req.body, user),
        ResponseCodes.Created,
      );
    }
    return next(user);
  } catch (error) {
    next(error);
  }
};

const getAllOrganizations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return responseHandler(res, await organizationService.getAllOrgs());
  } catch (error) {
    console.log('errors:', error);
    next(error);
  }
};

const removeChains = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | string = await userService.getUserFromToken(verifyJwtToken(req, next));

    if (user instanceof UserModel) {
      const { id, chains } = req.body;
      return responseHandler(res, await organizationService.removeChains(id, chains, user));
    }
    return next(user);
  } catch (error) {
    next(error);
  }
};

const getTotalOrgCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await organizationService.getAllOrgsCounts();
    if (error) next(error);
    return responseHandler(res, data);
  } catch (error) {
    return next(error);
  }
};

const getOrgById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { data, error } = await organizationService.getOrgById(id);
    if (error) return next(error);
    return responseHandler(res, data);
  } catch (error) {
    return next(error);
  }
};

export = {
  createOrganization,
  updateOrganization,
  getAllOrganizations,
  removeChains,
  getTotalOrgCount,
  getOrgById,
};
