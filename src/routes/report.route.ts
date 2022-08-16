import { Router } from 'express';

import authorize from 'middlewares/handlers/authorizeHandler';
import schemaValidator from 'middlewares/schemaValidator';
import schemas from 'middlewares/schemas/store.schema';
import reportController from 'controllers/report.controller';

import UserRoles from 'lib/enums/userRoles.enums';
import User from 'models/user.model';

const router = Router();

router.post(
  '/polygon/normal',
  authorize([UserRoles.Admin, UserRoles.OrganizationAdmin]),
  reportController.getNormalPolygonReport,
);

router.post(
  '/polygonMarkingSummary',
  authorize(UserRoles.Admin),
  reportController.getPolygonMarkingSummaryReport,
);

router.post(
  '/polygonMarkingDetail',
  authorize(UserRoles.Admin),
  reportController.getPolygonMarkingDetailReport,
);

export default router;
