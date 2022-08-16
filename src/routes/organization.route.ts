import { Router } from 'express';

import authorize from 'middlewares/handlers/authorizeHandler';
import organizationController from 'controllers/organization.controller';
import schemas from 'middlewares/schemas/organization.schema';
import schemaValidator from 'middlewares/schemaValidator';
import UserRoles from 'lib/enums/userRoles.enums';

const router = Router();

router.post(
  '/',
  authorize(UserRoles.Admin),
  schemaValidator(schemas.create),
  organizationController.createOrganization,
);
router.put(
  '/',
  authorize(UserRoles.Admin),
  schemaValidator(schemas.updateById),
  organizationController.updateOrganization,
);
router.get('/', authorize(UserRoles.Admin), organizationController.getAllOrganizations);
router.put(
  '/chains',
  authorize(UserRoles.Admin),
  schemaValidator(schemas.removeChains),
  organizationController.removeChains,
);

router.get('/count', authorize(UserRoles.Admin), organizationController.getTotalOrgCount);

router.get('/:id', authorize(UserRoles.Admin), organizationController.getOrgById);

export default router;
