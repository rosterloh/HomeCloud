'use strict';

var apiServer = require('./server');
var config = require('./config');

// Use environment variables for other options:
//   NODE_ENV=production API_SSL=1 API_PORT=443 node start.js

// Attach our api resource routes
var initApiRoutes = function(app, options) {
  app.use(options.baseUrlPath, require('./server/routes'));
};

// Start the api server
apiServer(initApiRoutes, config);
