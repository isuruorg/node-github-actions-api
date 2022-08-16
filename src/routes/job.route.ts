import { Router } from 'express';

import * as JobController from 'controllers/job.controller';
import schemaValidator from 'middlewares/schemaValidator';
import schemas from 'middlewares/schemas/job.schema';

const router = Router();
router.post('/', schemaValidator(schemas.createJobsSchema), (req, res) => {
  res.json({ status: 'success' });
});

router.get('/', JobController.getAllJobs);
// router.get('/', query('softDelete').isBpp, JobController.getAllJobs);

export default router;
  