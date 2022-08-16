import { Response } from 'express';
import ResponseCodes from 'lib/enums/responseCode.enum';

const responseHandler = (res: Response, data: any, status: number = ResponseCodes.Ok) => {
  return res.status(status).send({ data: data, error: null });
};

export default responseHandler;
