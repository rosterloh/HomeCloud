"use strict";

var path = require('path');


module.exports = {
  port: '8080',

  /*
      dataBackend can be 'datastore', 'cloudsql', or 'mongodb'. Be sure to
      configure the appropriate settings for each storage engine below.
      Note that datastore requires no additional configuration.
  */
  dataBackend: 'datastore',

  /*
    This can also be your project id as each project has a default
    bucket with the same name as the project id.
  */
  cloudStorageBucket: 'home-cloud-server',

  gcloud: {
    projectId: 'home-cloud-server'
  },

  mysql: {
    user: 'your-mysql-user-here',
    password: 'your-mysql-password-here',
    host: 'your-mysql-host-here'
  },

  mongodb: {
    url: 'your-mongo-url-here',
    collection: 'your-mongo-collection-here'
  }
};
