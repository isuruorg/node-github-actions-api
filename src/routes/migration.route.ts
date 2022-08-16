import UserController from 'controllers/user.controller';
import { Router } from 'express';
import UserRoles from 'lib/enums/userRoles.enums';
import authorize from 'middlewares/handlers/authorizeHandler';
import ManasaConnect from '../dataMigrations';

const router = Router();

router.get('/', ManasaConnect);

export default router;
