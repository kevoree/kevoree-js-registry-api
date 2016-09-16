'use strict';

var config = require('tiny-conf');
var urlTpl = require('./util/url-template');
var KevoreeRegistryError = require('./util/KevoreeRegistryError');
var urlHelper = require('./util/url-helper');
var fetch = require('node-fetch');

/**
 *
 * @param {String} namespace name
 * @returns {Promise}
 */
function tdefs(namespace) {
  var url = urlHelper(
    config.get('registry.host'),
    config.get('registry.port'),
    config.get('registry.ssl')
  );

  var path = '/api/tdefs';
  if (namespace) {
    path = '/api/namespaces/{namespace}/tdefs';
  }
  return Promise.resolve()
    .then(function () {
      return fetch(
        url + urlTpl.parse(path).expand({ namespace: namespace }),
        {
          headers: {
            'Accept': 'application/json'
          },
          mode: 'cors'
        }
      );
    })
    .then(function (resp) {
      if (resp.status === 200) {
        return resp.json();
      } else {
        return resp.json()
          .then(function (json) {
            throw new KevoreeRegistryError(json.message, resp.status);
          });
      }
    });
}

module.exports = tdefs;
