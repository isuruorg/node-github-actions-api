import UserController from 'controllers/user.controller';
import { Router } from 'express';
import UserRoles from 'lib/enums/userRoles.enums';
import authorize from 'middlewares/handlers/authorizeHandler';
import schemas from 'middlewares/schemas/user.schema';
import schemaValidator from 'middlewares/schemaValidator';

const router = Router();

router.get(
  '/',
  authorize(UserRoles.Admin),
  // schemaValidator(schemas.getAllUsers),
  UserController.getAllUsers,
);
router.post('/', schemaValidator(schemas.createUser), UserController.createUser);
router.post('/authenticate', schemaValidator(schemas.authenticate), UserController.authenticate);
router.get('/my-account', UserController.getMyAccount);
router.get(
  '/:id',
  authorize([UserRoles.Admin, UserRoles.OrganizationAdmin]),
  UserController.getUserByID,
);
router.put('/', schemaValidator(schemas.updateUser), UserController.editUserById);

router.post(
  '/password/default/:id',
  // authorize(UserRoles.Admin),
  UserController.resetToDefaultPassword,
);

router.post('/count', authorize([UserRoles.Admin]), UserController.getActiveOrInactiveUserCount);

router.post(
  '/password/reset',
  authorize([UserRoles.Admin, UserRoles.OrganizationAdmin, UserRoles.DataEntry]),
  schemaValidator(schemas.resetPassword),
  UserController.resetPassword,
);

export default router;
