"use strict";

var express = require('express');

module.exports = function(app, model, images, oauth2) {

  var router = express.Router();

  /*
    Use the images middleware to automatically upload images to Cloud Storage
  */
  app.use(images.multer);
  app.use(images.processUploads);


  /*
    Use the oauth middleware to automatically get the user's profile information
    and expose login/logout URLs to templates.
  */
  app.use(oauth2.aware);
  app.use(oauth2.template);

  function handleRpcError(err, res) {
    res.status(err.code || 500).send(err.message);
  }


  app.use(function(req, res, next){
    res.set('Content-Type', 'text/html');
    next();
  });


  router.get('/', function list(req, res) {
    var books = model.list(10, req.query.pageToken,
      function(err, entities, cursor) {
        if (err) return handleRpcError(err, res);
        res.render('books/list.jade', {
          books: entities,
          nextPageToken: cursor
        });
      }
    );
  });

  router.get('/mine', oauth2.required, function list(req, res) {
    var books = model.listBy(req.session.profile.id, 10, req.query.pageToken,
      function(err, entities, cursor) {
        if (err) return handleRpcError(err, res);
        res.render('books/list.jade', {
          books: entities,
          nextPageToken: cursor
        });
      }
    );
  });


  router.get('/add', function addForm(req, res) {
    res.render('books/form.jade', {
      book: {},
      action: 'Add'
    });
  });


  router.post('/add', function insert(req, res) {
    var data = req.body;

    // If the user is logged in, set them as the creator of the book.
    if (req.session.profile) {
      data.createdBy = req.session.profile.displayName;
      data.createdById = req.session.profile.id;
    } else {
      data.createdBy = 'Anonymous';
    }

    // Was an image uploaded? If so, we'll use its public URL in cloud storage.
    if (req.files.image && req.files.image.cloudStoragePublicUrl) {
      data.imageUrl = req.files.image.cloudStoragePublicUrl;
    }

    // Save the data to the database.
    model.create(data, function(err, savedData) {
      if (err) return handleRpcError(err, res);
      res.redirect(req.baseUrl + '/' + savedData.id);
    });
  });


  router.get('/:book/edit', function editForm(req, res) {
    model.read(req.params.book, function(err, entity) {
      if (err) return handleRpcError(err, res);
      res.render('books/form.jade', {
        book: entity,
        action: 'Edit'
      });
    });
  });


  router.post('/:book/edit', function update(req, res) {
    // Was an image uploaded? If so, we'll use its public URL in cloud storage.
    if (req.files.image && req.files.image.cloudStoragePublicUrl) {
      req.body.imageUrl = req.files.image.cloudStoragePublicUrl;
    }

    model.update(req.params.book, req.body, function(err, savedData) {
      if (err) return handleRpcError(err, res);
      res.redirect(req.baseUrl + '/' + savedData.id);
    });
  });


  router.get('/:book', function get(req, res) {
    model.read(req.params.book, function(err, entity) {
      if (err) return handleRpcError(err, res);
      res.render('books/view.jade', {
        book: entity
      });
    });
  });


  router.get('/:book/delete', function _delete(req, res) {
    model.delete(req.params.book, function(err) {
      if (err) return handleRpcError(err, res);
      res.redirect(req.baseUrl);
    });
  });


  return router;

};
