'use strict';

var d = require('../lib/datastore');

exports.getRefreshToken = function(token) {
  return null;/*var q = d.ds.createQuery(['refreshTokens'])
    .limit(1)
    .start(token);

  d.ds.runQuery(q, function(err, entities, cursor) {
    if (err) return err;
    return(null, entities.map(d.fromDatastore), entities.length === 1 ? cursor : false);
  });*/
};

exports.removeByUserIdClientId = function(userId, clientId) {
  return null;/*r.table('refreshTokens')
    .getAll([userId, clientId], {index: 'user_client'})
    .delete()
    .run();*/
};

exports.removeRefreshToken = function(token) {
  return null;/*r.table('refreshTokens')
    .get(token)
    .delete()
    .run();*/
};

exports.saveRefreshToken = function(token, userId, clientId, expiresMin) {
  return null;
  /*var expires = r.now().add(expiresMin * 60);
  return exports.removeByUserIdClientId(userId, clientId)
    .then(function(result) {
      return r.table('refreshTokens')
        .insert({id: token, userId: userId, clientId: clientId, expires: expires})
        .run();
    });*/
};
