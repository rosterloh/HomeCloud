'use strict';

var errors = require('../lib/errors');
//var path = require('path');

/**
 * Express route error handler: send back JSON error responses
 */
module.exports = function errorHandler(err, req, res, next) {
    // Set optional headers
    if (err.headers) {
        res.set(err.headers);
    }

    var response = {
        message: err.message  // Description of error
    };

    var status = err.status || 500;

    // Unique application error code
    response.code = err.code || status;

    // Additional field error messages
    if (err.errors) { response.errors = err.errors; }

    res.status(status).json(response);
};

/**
 * Express route error handler: send back error status and custom pages
 */
/*module.exports = function createErrorHandler(options) {
    return function(err, req, res, next) {
        if (err.headers) {
            res.set(err.headers);
        }

        var status = err.status || 500;
        res.status(status);

        if (status === 404 && options.custom404Page) {
            res.sendFile(path.resolve(path.join(options.webRootPath, options.custom404Page)));
        } else if (options.customErrorPage) {
            res.sendFile(path.resolve(path.join(options.webRootPath, options.customErrorPage)));
        } else {
            res.send(err.message);
        }
    };
};*/
