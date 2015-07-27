"use strict";

var path = require('path');


module.exports = {
  port: process.env.PORT || '8080',

  /* Secret is used by sessions to encrypt the cookie */
  secret: 'kuEhzDNBY_8mjT4DLId57AHH',

  /*
      dataBackend can be 'datastore', 'cloudsql', or 'mongodb'. Be sure to
      configure the appropriate settings for each storage engine below.
      Note that datastore requires no additional configuration.
  */
  dataBackend: 'datastore',

  logPath: process.env.LOG_PATH || './',
  /*
    This can also be your project id as each project has a default
    bucket with the same name as the project id.
  */
  cloudStorageBucket: 'home-cloud-server',

  gcloud: {
    projectId: 'home-cloud-server'
  },

  /*
    The client ID and secret can be obtained by generating a new Client ID for
    a web application on Google Developers Console.
  */
  oauth2: {
    clientId: '437417304285-lnb3unarsdh5nv8frcr848sk5omckqq3.apps.googleusercontent.com',
    clientSecret: 'b84dBPo9Xq33ZfZ-BMI3VMJ0',
    redirectUrl: process.env.OAUTH2_CALLBACK || 'http://localhost:8080/oauth2callback',
    scopes: ['email', 'profile']
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
