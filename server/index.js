'use strict';

var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var express = require('express');
var cors = require('cors');
var cfgDefaults = require('./config');
var https = require('https');
var http = require('http');
var gracefulShutdown = require('./lib/graceful-shutdown');
var enforceSsl = require('./middleware/enforce-ssl');
var logger = require('./middleware/request-logger');
var errorHandler = require('./middleware/error-handler');
var prettyPrint = require('./middleware/pretty-print');
var errors = require('./lib/errors');

module.exports = function startServer(appInitCb, options) {
    // Initialize the express app
    options = _.merge({}, cfgDefaults, options);

    var app = express();

    if (options.isBehindProxy) {
        // http://expressjs.com/api.html#trust.proxy.options.table
        app.enable('trust proxy');
    }

    // Logging requests
    app.use(logger({logger: options.logger}));

    // CORS Requests
    if (options.cors) {
        app.use(cors(options.cors));
    }

    if (options.isSslEnabled) {
        app.use(enforceSsl());
    }

    if (options.statusRoute) {
        app.get(options.statusRoute, function(req, res) {
            req.skipRequestLog = true;
            res.send('OK');
        });
    }

    // Convenient pretty json printing via `?pretty=true`
    app.use(prettyPrint(app));


    app.use(serveStatic(options.webRootPath, options.staticOptions));

    // 404 catch-all
    app.use(function(req, res, next) {
        next(new errors.NotFoundError());
    });
    
    // Error handler
    app.use(errorHandler);

    // Create a secure or insecure server
    var server;
    if (!options.isBehindProxy && options.isSslEnabled) {
        // Secure https server
        var sslOptions = {
            key:  fs.readFileSync(options.sslKeyFile),
            cert: fs.readFileSync(options.sslCertFile)
        };
        server = https.createServer(sslOptions, app);
    } else {
        // Insecure http server
        server = http.createServer(app);
    }

    // Limits maximum incoming headers count
    server.maxHeadersCount = options.maxHeadersCount;

    // Inactivity before a socket is presumed to have timed out
    server.timeout = options.serverTimeout;

    // Start the server on port
    server.listen(options.port, function listenCb() {
        var host = server.address().address;
        var port = server.address().port;
        var scheme = (server instanceof https.Server) ? 'https' : 'http';
        console.info('api server listening at %s://%s:%s', scheme, host, port);
        if (options.isGracefulShutdownEnabled) {
            gracefulShutdown(server);
        }
    });

    return server;
};
