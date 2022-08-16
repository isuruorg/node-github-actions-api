import { Router } from 'express';
import * as LabelController from 'controllers/label.controller';

const router = Router();

router.get('/', LabelController.getAllLabels);

export default router;
