import { Router } from 'express';

import authorize from 'middlewares/handlers/authorizeHandler';
import schemaValidator from 'middlewares/schemaValidator';
import schemas from 'middlewares/schemas/store.schema';
import storeController from 'controllers/store.controller';
import upload from 'services/multer.service';
import UserRoles from 'lib/enums/userRoles.enums';
import User from 'models/user.model';

const router = Router();

router.post('/', authorize(UserRoles.Admin), upload.single('file'), storeController.createStores);

router.post(
  '/chains/marked',
  authorize([UserRoles.Admin, UserRoles.OrganizationAdmin, UserRoles.DataEntry]),
  storeController.getGeoCodesForMarkedStores,
);

router.get('/chains/count', authorize([UserRoles.Admin]), storeController.getTotalChainsCount);

router.get(
  '/chains/percentages',
  authorize([UserRoles.Admin, UserRoles.DataEntry]),
  schemaValidator(schemas.defaultQuery),
  storeController.getChainList,
);

router.get(
  '/chains/:chain',
  authorize([UserRoles.Admin, UserRoles.DataEntry]),
  schemaValidator(schemas.defaultQuery),
  storeController.getAllStoresByChain,
);

router.put(
  '/geocodes',
  authorize([UserRoles.Admin, UserRoles.DataEntry]),
  storeController.saveGeoCodes,
);
router.post(
  '/next',
  authorize([UserRoles.Admin, UserRoles.DataEntry, UserRoles.OrganizationAdmin]),
  storeController.getNextStore,
);

router.get(
  '/dataEntry/counts',
  authorize([UserRoles.Admin, UserRoles.OrganizationAdmin, UserRoles.DataEntry]),
  storeController.getDataEntryCounts,
);

router.get('/unallocate', authorize(UserRoles.Admin), storeController.unAllocatedStores);

router.get(
  '/gps/:id',
  authorize([UserRoles.Admin, UserRoles.DataEntry]),
  storeController.getStoreWithGPS,
);
// router.get(
//   '/:storeID',
//   authorize([UserRoles.Admin, UserRoles.DataEntry]),
//   storeController.getStoreByChainID,
// );

export default router;
