import { NextFunction, Request, Response } from 'express';

import { Label } from 'lib/interfaces/models';
import * as LabelService from 'services/label.service';
import responseHandler from 'middlewares/handlers/responseHandler';

const getAllLabels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const labels: Label[] = await LabelService.findAll();
    responseHandler(res, labels);
  } catch (error) {
    next(error);
  }
};

export { getAllLabels };
