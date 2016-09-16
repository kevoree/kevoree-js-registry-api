'use strict';

var config = require('tiny-conf');
var KevoreeRegistryError = require('./util/KevoreeRegistryError');
var urlHelper = require('./util/url-helper');
var fetch = require('node-fetch');

/**
 *
 * @returns {Promise}
 */
function whoami() {
  var url = urlHelper(
    config.get('registry.host'),
    config.get('registry.port'),
    config.get('registry.ssl')
  );

  return Promise.resolve()
    .then(function () {
      return fetch(
        url + '/api/authenticate',
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + config.get('auth.access_token')
          },
          mode: 'no-cors'
        }
      );
    })
    .then(function (resp) {
      if (resp.status === 200) {
        return resp.text();
      } else {
        return resp.json()
          .then(function (json) {
            throw new KevoreeRegistryError(json.message, resp.status);
          });
      }
    });
}

module.exports = whoami;
