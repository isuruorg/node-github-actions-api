import { NextFunction, Request, Response } from 'express';

import responseHandler from 'middlewares/handlers/responseHandler';
import UserModel from 'models/user.model';
import UserService from 'services/user.service';
import { verifyJwtToken } from 'lib/utils/jwt.utils';
import { User } from 'lib/interfaces/models';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.createUser(req.body);
    console.log('user::', user);
    if (user instanceof UserModel) {
      responseHandler(res, user);
    } else {
      next(user);
    }
  } catch (error) {
    next(error);
  }
};

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.validatePassword(req.body.email, req.body.password);
    if (user instanceof Object) {
      responseHandler(res, user);
    } else {
      next(user);
    }
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    responseHandler(res, await UserService.getAllUsers());
  } catch (error) {
    next(error);
  }
};

const getMyAccount = async (req: Request, res: Response, next: NextFunction) => {
  const user: User | string = await UserService.getUserFromToken(verifyJwtToken(req, next));
  if (user instanceof UserModel) {
    return responseHandler(res, await UserService.getUserById(String(user._id)));
  }
  return next(user);
};

const editUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return responseHandler(res, await UserService.editUserById(req.body));
  } catch (error) {
    console.log('error::', error);
    return next(error);
  }
};

const getUserByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    console.log('userss::', user);
    return responseHandler(res, user);
  } catch (error) {
    return next(error);
  }
};

const getActiveOrInactiveUserCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { active } = req.body;
    const { data, error } = await UserService.getActiveOrInactiveUserCount(active || true);
    if (error) next(error);
    return responseHandler(res, data);
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, currentPassword, newPassword } = req.body;
    const { data, error } = await UserService.resetPassword(id, currentPassword, newPassword);
    if (error) return next(error);
    return responseHandler(res, data);
  } catch (error) {
    return next(error);
  }
};

const resetToDefaultPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { data, error } = await UserService.resetToDefaultPassword(String(id));
    if (error) return next(error);
    return responseHandler(res, data);
  } catch (error) {
    return next(error);
  }
};

export = {
  createUser,
  authenticate,
  getAllUsers,
  getMyAccount,
  editUserById,
  getUserByID,
  getActiveOrInactiveUserCount,
  resetPassword,
  resetToDefaultPassword,
};
