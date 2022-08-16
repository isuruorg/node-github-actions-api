require('models/user.model');
require('models/organization.model');
require('models/counter.model');
require('models/job.model');
require('models/label.model');
require('models/naicsCode');
require('models/store.model');

import mongoose from 'mongoose';

function connect() {
  return (
    mongoose
      .connect(process.env.DB_CONNECTION_STRING, { dbName: process.env.DATABASE })
      // .connect(dbUri)
      .then(() => {
        console.log(`Database-${process.env.NODE_ENV} connected`);
      })
      .catch(error => {
        console.log('db error:', error);
        process.exit(1);
      })
  );
}

export default connect;
