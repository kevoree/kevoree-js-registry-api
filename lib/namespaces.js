'use strict';

var config = require('tiny-conf');
var fetch = require('node-fetch');

var urlHelper = require('./util/url-helper');
var KevoreeRegistryError = require('./util/KevoreeRegistryError');

/**
 *
 * @returns {Promise}
 */
function namespaces() {
  var url = urlHelper(
    config.get('registry.host'),
    config.get('registry.port'),
    config.get('registry.ssl')
  );
  return Promise.resolve()
    .then(function () {
      return fetch(
        url + '/api/namespaces',
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
        throw new KevoreeRegistryError(resp.statusText, resp.status);
      }
    });
}

module.exports = namespaces;
