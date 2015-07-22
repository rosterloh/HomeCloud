"use strict";

var gcloud = require('gcloud');


module.exports = function (gcloudConfig, cloudStorageBucket) {

  var storage = gcloud.storage(gcloudConfig);
  var bucket = storage.bucket(cloudStorageBucket);

  /*
    Returns the public, anonymously accessable URL to a given Cloud Storage object.
    The object's ACL has to be set to public read.
  */
  function getPublicUrl(filename) {
    return 'https://' + cloudStorageBucket + '.storage.googleapis.com/' + filename;
  }


  /*
    Express middleware that will automatically pass uploads to Cloud Storage.
    Each file in req.files is processed and will have two new properties:
    * ``cloudStorageObject`` the object name in cloud storage.
    * ``cloudStoragePublicUrl`` the public url to the object.
  */
  function processUploads(req, resp, next) {

    var numFiles = Object.keys(req.files).length;
    if (!numFiles) return next();

    function checkNext(err) {
      numFiles--;
      if (numFiles === 0) next();
    }

    Object.keys(req.files).forEach(function(key) {
      var uploadedFile = req.files[key];
      var file = bucket.file(uploadedFile.name);
      var stream = file.createWriteStream();

      stream.on('error', function(err) {
        uploadedFile.cloudStorageError = err;
        checkNext();
      });

      stream.on('complete', function() {
        uploadedFile.cloudStorageObject = uploadedFile.name;
        uploadedFile.cloudStoragePublicUrl = getPublicUrl(uploadedFile.name);
        file.makePublic(checkNext);
      });

      stream.end(uploadedFile.buffer);
    });
  }


  /*
    Multer handles parsing multipart/form-data requests.
    This instance is configured to store images in memory and re-name to avoid
    conflicting with existing objects. This makes it straightforward to upload
    to Cloud Storage.
  */
  var multer = require('multer');
  multer = multer({
    inMemory: true,
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
    rename: function(fieldname, filename) {
      // generate a unique filename
      return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
    }
  });


  return {
    getPublicUrl: getPublicUrl,
    processUploads: processUploads,
    multer: multer
  };

};
