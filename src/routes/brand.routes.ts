import { Router } from 'express';

import authorize from 'middlewares/handlers/authorizeHandler';
import brandController from 'controllers/brand.controller';
import schemas from 'middlewares/schemas/brand.schema';
import schemaValidator from 'middlewares/schemaValidator';
import UserRoles from 'lib/enums/userRoles.enums';

const router = Router();

router.post(
  '/',
  authorize(UserRoles.Admin),
  schemaValidator(schemas.createBrand),
  brandController.createBrand,
);

router.get(
  '/',
  authorize(UserRoles.Admin),
  schemaValidator(schemas.getBrands),
  brandController.getBrands,
);

router.put('/:id', authorize(UserRoles.Admin), brandController.editById);

export default router;
