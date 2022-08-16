import { NextFunction, Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const generateJwt = (id: string, role: string) => {
  return jwt.sign({ id, role }, 'secured-traceclaw', {
    expiresIn: '1d', // expires in 1 day
  });
};

export const reteriveJwtToken = (req: Request, next: NextFunction): string => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    return bearer[1];
  } else {
    next('Unathorized');
  }
};

export const verifyJwtToken = (req: Request, next: NextFunction): any => {
  try {
    const token = reteriveJwtToken(req, next);
    return jwt.verify(token, 'secured-traceclaw');
  } catch (error) {
    next(error);
  }
};
