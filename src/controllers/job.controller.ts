import { NextFunction, Request, Response } from 'express';

import * as JobService from 'services/job.service';
import { Job } from 'lib/interfaces/models';
import responseHandler from 'middlewares/handlers/responseHandler';

const getAllJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { softDelete } = req.query;
    const jobs: Job[] = await JobService.findAll(softDelete.toString());
    responseHandler(res, jobs);
  } catch (error) {
    next(error);
  }
};

export { getAllJobs };
