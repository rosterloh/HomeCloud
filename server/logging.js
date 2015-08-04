"use strict";

var fs = require('fs');
var path = require('path');
var winston = require('winston');
var expressWinston = require('express-winston');


module.exports = function(logPath) {

  // Create logging directory if necessary.
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
  }


  /*
   Logger to capture all requests and output them to the console
   as well as request.log.
   */
  var requestLogger = expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: false
      }),
      new winston.transports.File({
        filename: path.join(logPath, 'request.log'),
      })
    ],
    expressFormat: true
  });


  /*
   Logger to capture any top-level errors from requests and
   output them in error.log
   */
  var errorLogger = expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({
        json: false
      }),
      new winston.transports.File({
        filename: path.join(logPath, 'error.log'),
      })
    ]
  });


  /*
   General logger used for .log, .info, etc. Outputs all logs
   to the console as well as general.log.
   */
  winston.add(winston.transports.File, {
    filename: path.join(logPath, 'general.log')
  });


  return {
    requestLogger: requestLogger,
    errorLogger: errorLogger,
    error: winston.error,
    warn: winston.warn,
    info: winston.info,
    log: winston.log,
    verbose: winston.verbose,
    debug: winston.debug,
    silly: winston.silly
  };

};
