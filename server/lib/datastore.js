'use strict';

var config = require('../../config');
var gcloud = require('gcloud');

module.exports = {

  ds: gcloud.datastore.dataset(config.gcloud),

  /*
    Translates from Datastore's entity format to
    the format expected by the application.

    Datastore format:
      {
        key: [kind, id],
        data: {
          property: value
        }
      }

    Application format:
      {
        id: id,
        property: value
      }
  */
  fromDatastore: function(obj) {
    obj.data.id = obj.key.path[obj.key.path.length - 1];
    return obj.data;
  },


  /*
    Translates from the application's format to the datastore's
    extended entity property format. It also handles marking any
    specified properties as non-indexed. Does not translate the key.

    Application format:
      {
        id: id,
        property: value,
        unindexedProperty: value
      }

    Datastore extended format:
      [
        {
          name: property,
          value: value
        },
        {
          name: unindexedProperty,
          value: value,
          excludeFromIndexes: true
        }
      ]
  */
  toDatastore: function (obj, nonIndexed) {
    nonIndexed = nonIndexed || [];
    var results = [];
    Object.keys(obj).forEach(function(k) {
      if (obj[k] === undefined) return;
      results.push({
        name: k,
        value: obj[k],
        excludeFromIndexes: nonIndexed.indexOf(k) !== -1
      });
    });
    return results;
  }

};
