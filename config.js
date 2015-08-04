'use strict';

var path = require('path');


module.exports = {
  // A base URL path prefix, i.e. "/api"
  baseUrlPath: process.env.API_BASE_URL || '/api',

  port: process.env.PORT || '8080',

  // HTTPS key/cert file paths
  //sslKeyFile:  process.env.API_SSL_KEY  || path.join(__dirname, '/keys/60638403-localhost.key'),
  //sslCertFile: process.env.API_SSL_CERT || path.join(__dirname, '/keys/60638403-localhost.cert'),

  // Cross-site HTTP requests
  // https://github.com/expressjs/cors#configuring-cors
  cors: {},

  // JWT Options
  jwt: {
    secret: process.env.API_JWT_SECRET || 'a8265adf-941c-4d6e-b28b-8fa9318bcae7',
    opts: {
      expiresInMinutes: 5
    },
    refreshExpiresInMinutes: 10080 // 1 week
  },

  // Crypto Hash Options
  crypto: {
    iterations: parseInt(process.env.API_HASH_ITERATIONS || 4096),
    keylen: parseInt(process.env.API_HASH_KEYLEN || 512),
    digest: 'sha256'
  },

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
