import express from 'express';
const router = express.Router();

import labelRoutes from 'routes/label.route';
import JobRouter from 'routes/job.route';
import OrganizationRouter from 'routes/organization.route';
import UserRouter from 'routes/user.route';
import StoreRouter from 'routes/store.route';
import reportRouter from 'routes/report.route';
import migrationRouter from 'routes/migration.route';
import brandRouter from 'routes/brand.routes';

router.use('/jobs', JobRouter);
router.use('/labels', labelRoutes);
router.use('/users', UserRouter);
router.use('/stores', StoreRouter);
router.use('/orgs', OrganizationRouter);
router.use('/reports', reportRouter);
router.use('/migrations', migrationRouter);
router.use('/brands', brandRouter);

export default router;
