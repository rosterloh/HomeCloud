"use strict";

var path        = require('path'),
    express     = require('express'),
    gcloud      = require('gcloud'),
    bodyParser  = require('body-parser'),
    config      = require('./config');

var app = express();

app.disable('etag');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy', true);

// Angular Http content type for POST etc defaults to text/plain at
app.use(bodyParser.text(), function ngHttpFix(req, res, next) {
  try {
    req.body = JSON.parse(req.body);
    next();
  } catch(e) {
    next();
  }
});

app.use(express.static('public'));

/* Include the app engine handlers to respond to start, stop, and health checks. */
app.use(require('./lib/appengine-handlers'));

/* API */
var images = require('./lib/images')(config.gcloud, config.cloudStorageBucket);
var model = require('./books/model-' + config.dataBackend)(config);

app.use('/books', require('./books/crud')(model, images));
app.use('/api/books', require('./books/api')(model));

//var api = require('./todo_api')();
//app.use('/api', api);

/* Redirect root to /books */
app.get('/', function(req, res) {
  res.redirect('/books');
});

/* Basic error handler */
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

/* Start the server */
var server = app.listen(config.port, '0.0.0.0', function() {
  console.log('App listening at http://%s:%s', server.address().address, server.address().port);
  console.log("Press Ctrl+C to quit.");
});
