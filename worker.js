"use strict";

var request = require('request');
var waterfall = require('async').waterfall;
var express = require('express');
var config = require('./config');

var logging = require('./lib/logging')(config.logPath);
var images = require('./lib/images')(config.gcloud, config.cloudStorageBucket, logging);
var background = require('./lib/background')(config.gcloud, logging);

/*
 We'll pass this to the model so that we don't get an infinite loop of book
 processing requests.
 */
var backgroundStub = {
  queueBook: function(bookId, cb){ if(cb) cb(); }
};

var model = require('./books/model-datastore')(config, backgroundStub);


/* Keep count of how many books this worker has processed */
var bookCount = 0;


/*
 When running on Google App Engine Managed VMs, the worker needs
 to respond to health checks. We can re-use the health checks
 from the main application and create a simple server.
 */
var app = express();

app.use(logging.requestLogger);
app.use(require('./lib/appengine-handlers'));

app.get('/', function(req, res) {
  res.send('This worker has processed ' + bookCount + ' books.');
});

app.use(logging.errorLogger);

var server = app.listen(config.port, '0.0.0.0', function() {
  console.log('Worker server listening at http://%s:%s', server.address().address, server.address().port);
  console.log("Press Ctrl+C to quit.");
});


/*
 Subscribe to Cloud Pub/Sub and recieve messages to process books.
 The subscription will continue to listen for messages until the server
 is killed.
 */
background.subscribe(function(message) {
  if (message.action == 'processBook') {
    logging.info('Received request to process book ' + message.bookId);
    processBook(message.bookId);
  } else {
    logging.warn('Unknown request', message);
  }
});


/*
 Processes a book by reading its existing data, attempting to find
 more information, and updating the database with the new information.
 */
function processBook(bookId) {
  waterfall([
    /* Load the current data */
    function(cb) {
      model.read(bookId, cb);
    },
    /* Find the information from Google */
    findBookInfo,
    /* Save the updated data */
    function(updated, cb) {
      model.update(updated.id, updated, cb, true);
      bookCount += 1;
    }
  ], function(err) {
    if (err) logging.error("Error occurred", err);
    else logging.info("Updated book " + bookId);
  });
}


/*
 Tries to find additional information about a book and updates
 the book's data. Also uploads a cover image to Cloud Storage
 if available.
 */
function findBookInfo(book, cb) {
  queryBooksApi(book.title, function(err, r) {
    if (err) return cb(err);
    if (!r.items) return cb("Not found");
    var top = r.items[0];

    book.title = top.volumeInfo.title;
    book.author = top.volumeInfo.authors.join(', ');
    book.publishedDate = top.volumeInfo.publishedDate;
    book.description = book.description || top.volumeInfo.description;

    /*
     If there is already an image for the book or if there's no
     thumbnails, go ahead and return.
     */
    if (book.imageUrl || !top.volumeInfo.imageLinks) return cb(null, book);

    // Otherwise, try to fetch them and upload to cloud storage.
    var imageUrl = top.volumeInfo.imageLinks.thumbnail || top.volumeInfo.imageLinks.smallThumbnail;
    var imageName = book.id + '.jpg';

    images.downloadAndUploadImage(imageUrl, imageName, function(err, publicUrl) {
      if (!err) book.imageUrl = publicUrl;
      cb(null, book);
    });
  });
}


/*
 Calls out to the Google Books API to get additional
 information about a given book.
 */
function queryBooksApi(query, cb) {
  request(
    'https://www.googleapis.com/books/v1/volumes?q=' + encodeURIComponent(query),
    function(err, resp, body) {
      if (err || resp.statusCode != 200) return cb(err || "Response returned " + resp.statusCode);
      cb(null, JSON.parse(body));
    }
  );
}
