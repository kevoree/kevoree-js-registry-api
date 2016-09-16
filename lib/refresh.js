'use strict';

var config = require('tiny-conf');
var fetch = require('node-fetch');

var urlHelper = require('./util/url-helper');
var KevoreeRegistryError = require('./util/KevoreeRegistryError');


/**
 *
 * @returns {Promise}
 */
function refresh() {
  var url = urlHelper(
    config.get('registry.host'),
    config.get('registry.port'),
    config.get('registry.ssl')
  );

  var clientSecret = config.get('registry.oauth.client_secret') ||
    'kevoree_registryapp_secret';
  var clientId = config.get('registry.oauth.client_id') ||
    'kevoree_registryapp';

  return Promise.resolve()
    .then(function () {
      var data = 'grant_type=refresh_token&refresh_token=' +
        config.get('auth.refresh_token');
      return fetch(
        url + '/oauth/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data),
            'Accept': 'application/json',
            'Authorization': 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64')
          },
          body: data,
          mode: 'no-cors'
        }
      );
    })
    .then(function (resp) {
      if (resp.status === 200) {
        return resp.json()
          .then(function (auth) {
            try {
              auth.expires_at = Math.floor(new Date().getTime() / 1000) + auth.expires_in;
              delete auth.expires_in;
              config.set('auth', auth);
            } catch (err) {
              throw new KevoreeRegistryError(resp.statusText, resp.status);
            }
          });
      } else {
        throw new KevoreeRegistryError(resp.statusText, resp.status);
      }
    });
}

module.exports = refresh;
