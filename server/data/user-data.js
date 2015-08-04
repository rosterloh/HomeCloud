'use strict';

var d = require('../lib/datastore');

exports.getUsers = function(limit, index) {
    limit = parseInt(limit || 20);
    index = parseInt(index || 0);
    var q = d.ds.createQuery(['users'])
        .limit(limit)
        .offset(index);

    d.ds.runQuery(q, function(err, entities, cursor) {
        if (err) return err;
        //return(null, entities.map(d.fromDatastore), entities.length < limit ? cursor : false);
        return entities.map(d.fromDatastore);
    });
    //return r.table('users').slice(index, limit).run();
};

exports.getUser = function(id) {
  var q = d.ds.createQuery(['users'])
      .limit(1)
      .filter('id = ', id);

  d.ds.runQuery(q, function(err, entities, cursor) {
      if (err) return err;
      //return(null, entities.map(d.fromDatastore), entities.length === 1 ? cursor : false);
      return entities.map(d.fromDatastore);
  });
    //return r.table('users').get(id).run();
};

exports.findUserByEmail = function(email) {
  var q = d.ds.createQuery(['users'])
    .limit(1)
    .filter('email = ', email);

  d.ds.runQuery(q, function(err, entities, cursor) {
    if (err) return err;
    //return(null, entities.map(d.fromDatastore), entities.length === 1 ? cursor : false);
    return entities.map(d.fromDatastore);
  });
  /*return r.table('users')
      .getAll(email, {index: 'email'})
      .run()
      .then(function(result) {
        return (result && result.length > 0) ? result[0] : null;
      });*/
};
