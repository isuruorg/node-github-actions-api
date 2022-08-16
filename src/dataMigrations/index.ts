import UserRoles from 'lib/enums/userRoles.enums';
import Organization from 'models/organization.model';
import User from 'models/user.model';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import storeModel from 'models/store.model';
import SlackService from 'services/slack.service';
import { TRACECLAW_BUILD_TEST_DEPLOY_CHANNEL } from 'lib/utils/slackChannels.utils';

const MongoClient = require('mongodb').MongoClient;
const dbClient = new MongoClient(process.env.MIGRATION_DB_HOST, { useUnifiedTopology: true });

const rolesMapper = {
  SuperAdmin: UserRoles.Admin,
  DataEntry: UserRoles.DataEntry,
};

const migrateUsers = async (users: any[], organizations: any[]) => {
  users.map(async user => {
    const role = rolesMapper[user.role];
    const password = role === UserRoles.Admin ? `TraceClaw-${user.email}@2022` : `TraceClaw@2o22`;
    const currentOrg = organizations.find(org => {
      return JSON.stringify(org._id) === JSON.stringify(user.organization);
    });

    const newOrg = user?.organization
      ? await Organization.findOne({ name: currentOrg.name })
      : null;

    const newUser = new User({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      active: true,
      passwordHash: bcrypt.hashSync(password, 10),
      organization: newOrg && newOrg._id,
      role: rolesMapper[user.role],
    });
    try {
      await newUser.save();
    } catch (error) {}
  });
};

const migrateOrganizations = async (orgs: any[]) => {
  orgs.map(async org => {
    const newOrg = new Organization({
      name: org.name,
      email: org.email,
      accessibleChains: org.accessibleChains,
    });
    try {
      await newOrg.save();
    } catch (error) {}
  });
};

const migrateStores = async (storesCursor: any[], geoCodes: any[], users: any[]) => {
  let count = 0;
  let skipped = 0;
  for await (const store of storesCursor) {
    const geoCode = geoCodes.find(gc => {
      return JSON.stringify(gc.storeId) === JSON.stringify(store._id);
    });

    const user = users.find(user => user.username === geoCode?.userId);
    const editor = await User.findOne({ email: user?.email }); // find the correct current user from db

    const contactInfo = store.contactInfo;
    const hours = {};
    if (store.operatingHours) {
      Object.keys(store.operatingHours).map(data => {
        const value = store.operatingHours[data];
        try {
          const key = Object.keys(value)[0];
          const splitted = value[key].split(',');
          const first = splitted[0]?.replace('[', '').replace("'", '').replace("'", '');
          const second = splitted[1]?.replace(']', '').replace("'", '').replace("'", '').trim();
          hours[key] = [first, second];
        } catch (error) {}
      });
    }

    const operatingHours = {};
    const timestamp = dayjs().unix();

    operatingHours[timestamp] = hours;
    const geoCodesToSave =
      (geoCode && {
        general: {
          type: geoCode?.type,
          features: [geoCode?.features[0]],
        },
      }) ||
      null;

    const newStore = {
      chain: store.chain,
      address: store.address,
      store: store.storeName,
      postalCode: store?.postalCode,
      host: store?.host,
      email: contactInfo ? contactInfo[0]?.email : '',
      phone: contactInfo
        ? [
            store.contactInfo[0].phone
              .replace('[', '')
              .replace(']', '')
              .replace("'", '')
              .replace("'", ''),
          ]
        : [],
      fax: contactInfo
        ? [
            store.contactInfo[0].fax
              .replace('[', '')
              .replace(']', '')
              .replace("'", '')
              .replace("'", ''),
          ]
        : [],
      operatingHours,
      openStatus: store.openStatus,
      parkingLot: store.parkingLot === 0,
      geoCode: geoCodesToSave,
      geoCodeAddedAt: geoCode && geoCode.createdAt,
      geoCodeUpdatedAt: geoCode && geoCode.updatedAt,
      geoCodeCreator: editor && editor._id,
      category: store?.category,
      placeKey: store?.placeKey,
      location: store?.location,
      traceclawPlaceId: store?.traceclawPlaceId,
      traceclawBrandIds: store?.traceclawBrandIds,
      brand: store?.brand,
      topCategory: store?.topCategory,
      subCategory: store?.subCategory,
      naicsCode: store?.naicsCode,
      polygonWkt: store?.polygonWkt,
      polygonClass: store?.polygonClass,
      buildingHeight: store?.buildingHeight,
      enclosed: store?.enclosed,
      categoryTags: store?.categoryTags,
      trackingOpenedSince: store?.trackingOpenedSince,
      trackingClosedSince: store?.trackingClosedSince,
      isoCountryCode: store?.isoCountryCode,
      parentPlacekey: store?.parentPlacekey,
      parentTraceclawPlaceId: store?.parentTraceclawPlaceId,
      userLocationId: store?.userLocationId,
      poi_id: store?.poi_id,
      lat: store?.lat,
      lon: store?.lon,
      assigned: store?.allocated || false,
      isCompleted: !!geoCodesToSave,
    };
    Object.keys(newStore).forEach(
      key => (newStore[key] === null || newStore[key] === undefined) && delete newStore[key],
    );
    const data = new storeModel(newStore);
    try {
      count++;
      await data.save();
    } catch (error) {
      skipped++;
    }
    console.log('count::', count, '>>', !!geoCode);
  }
  console.log('finished with errors:', skipped);
};

const getDocuments = async (db, collection: string) => {
  const data = await db.collection(collection).find({});
  return data.toArray();
};

const getDocumentsAs = async (db, collection: string) => await db.collection(collection).find({});

const collectionNames = ['organizations', 'geocodes', 'stores', 'users'];

let orgs = [];
let geoCodes = [];
let users = [];

function ManasaConnect(req, res) {
  if (process.env.MIGRATION_ENABLED !== 'yes') {
    SlackService.sendMessage(
      TRACECLAW_BUILD_TEST_DEPLOY_CHANNEL,
      'Attempt of Data Migration Cancelled due to configuration is switch off.' +
        ' If you intented to trnasfer data, make sure to change config',
    );
    return res.send('Data Migration is restricted');
  }

  SlackService.sendMessage(
    TRACECLAW_BUILD_TEST_DEPLOY_CHANNEL,
    'Data migration started  for TraceClaw V2,' +
      ' this may take while depending on the amount of data, sit tight...',
  );
  return dbClient
    .connect()
    .then(() => {
      const db = dbClient.db(process.env.MIGRATION_DB);
      collectionNames.forEach(async name => {
        const data = await getDocuments(db, name);

        console.log('getting data for ', name, '>>', data.length);
        if (name === 'organizations') {
          SlackService.sendMessage(
            TRACECLAW_BUILD_TEST_DEPLOY_CHANNEL,
            `Data Migration started for Organizations with ${data.length} records`,
          );
          orgs = data;
          await migrateOrganizations(data);
        } else if (name === 'users' && orgs.length > 0) {
          SlackService.sendMessage(
            TRACECLAW_BUILD_TEST_DEPLOY_CHANNEL,
            `Data migration started for Users with ${data.length} records`,
          );
          users = data;
          migrateUsers(data, orgs);
        } else if (name === 'geocodes') {
          geoCodes = data;
          console.log('geo code count:', geoCodes.length);
        } else if (name === 'stores') {
          SlackService.sendMessage(
            TRACECLAW_BUILD_TEST_DEPLOY_CHANNEL,
            `Data Migration started for geoCodes & stores with ${geoCodes.length} & ${data.length} records`,
          );
          const cursor = await getDocumentsAs(db, name);
          migrateStores(cursor, geoCodes, users);
        }
      });
    })
    .then(() => {
      SlackService.sendMessage(
        TRACECLAW_BUILD_TEST_DEPLOY_CHANNEL,
        'Data Migration Completed Succesfully',
      );
      res.send('Data Migration Completed Successfully');
    })
    .catch(error => {
      console.log('db error', error);
      SlackService.sendMessage(
        TRACECLAW_BUILD_TEST_DEPLOY_CHANNEL,
        `Data migration failed with errors: ${error}`,
      );
      res.sendStatus(500);
    });
}

export default ManasaConnect;
