"use strict";

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;


module.exports = function(config) {

  var url = config.mongodb.url;
  var collectionName = config.mongodb.collection;


  function fromMongo(item) {
    if (item.length) item = item.pop();
    item.id = item._id;
    delete item._id;
    return item;
  }


  function toMongo(item) {
    delete item.id;
    return item;
  }


  function getCollection(cb) {
    MongoClient.connect(url, function(err, db) {
      if (err) {
        console.log(err);
        return cb(err);
      }
      cb(null, db.collection(collectionName));
    });
  }


  function list(limit, token, cb) {
    token = token ? parseInt(token, 10) : 0;
    getCollection(function(err, collection) {
      if (err) return cb(err);
      collection.find({})
        .skip(token)
        .limit(limit)
        .toArray(function(err, results) {
          if (err) return cb(err);
          cb(null, results.map(fromMongo), results.length === limit ? token + results.length : false);
        });
    });
  }


  function create(data, cb) {
    getCollection(function(err, collection) {
      if (err) return cb(err);
      collection.insert(data, {w: 1}, function(err, result) {
        if (err) return cb(err);
        var item = fromMongo(result.ops);
        cb(null, item);
      });
    });
  }


  function read(id, cb) {
    getCollection(function(err, collection) {
      if (err) return cb(err);
      collection.findOne({
        _id: new ObjectID(id)
      }, function(err, result) {
        if (err) return cb(err);
        if (!result) return cb({
          code: 404,
          message: "Not found"
        });
        cb(null, fromMongo(result));
      });
    });
  }


  function update(id, data, cb) {
    getCollection(function(err, collection) {
      if (err) return cb(err);
      collection.update({
          _id: new ObjectID(id)
        }, {
          '$set': toMongo(data)
        },
        {w: 1},
        function(err) {
          if (err) return cb(err);
          return read(id, cb);
        }
      );
    });
  }


  function _delete(id, cb) {
    getCollection(function(err, collection) {
      if (err) return cb(err);
      collection.remove({
        _id: new ObjectID(id)
      }, cb);
    });
  }

  return {
    create: create,
    read: read,
    update: update,
    delete: _delete,
    list: list
  };

};
