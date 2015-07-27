"use strict";

var path        = require('path'),
    express     = require('express'),
    session     = require('cookie-session'),
    gcloud      = require('gcloud'),
    bodyParser  = require('body-parser'),
    config      = require('./config')
    logging     = require('./lib/logging')(config.logPath);

var app = express();

app.disable('etag');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy', true);

/*
  Add the request logger before anything else so that it can
  accurately log requests.
*/
app.use(logging.requestLogger);

/*
  Configure the session and session storage.
  MemoryStore isn't viable in a multi-server configuration, so we
  use encrypted cookies. Redis or Memcache is a great option for
  more secure sessions, if desired.
*/
app.use(session({
  secret: config.secret,
  signed: true
}));

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

/* OAuth2 */
var oauth2 = require('./lib/oauth2')(config.oauth2);

app.use(oauth2.router);

/* API */
var background = require('./lib/background')(config.gcloud, logging);
var images = require('./lib/images')(config.gcloud, config.cloudStorageBucket, logging);
var model = require('./books/model-datastore')(config, background);

app.use('/books', require('./books/crud')(app, model, images, oauth2));
app.use('/api/books', require('./books/api')(model));

//var api = require('./todo_api')();
//app.use('/api', api);

/* Redirect root to /books */
app.get('/', function(req, res) {
  res.redirect('/books');
});


/*
  Add the error logger after all middleware and routes so that
  it can log errors from the whole application. Any custom error
  handlers should go after this.
*/
app.use(logging.errorLogger);

/* Start the server */
var server = app.listen(config.port, '0.0.0.0', function() {
  console.log('App listening at http://%s:%s', server.address().address, server.address().port);
  console.log("Press Ctrl+C to quit.");
});
