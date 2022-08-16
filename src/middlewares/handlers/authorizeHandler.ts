export {};

import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

/**
 * roles param can be a single role string (e.g. UserRoles.Admin or [UserRoles.Admin, UserRoles.QA])
 * @param roles - accessible roles
 * @returns
 */
function authorize(roles: string[] | string = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return [
    // authorize based on user role
    (req: Request, res: Response, next: NextFunction) => {
      const bearerHeader = req.headers['authorization'];
      if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        const tokenStatus = jwt.verify(bearerToken, 'secured-traceclaw');
        if (roles.length && roles.includes(tokenStatus['role'])) {
          next();
        } else {
          next('Unathorized');
        }
      } else {
        next('Unathorized');
      }
    },
  ];
}
export default authorize;
