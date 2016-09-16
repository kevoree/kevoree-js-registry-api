'use strict';

var config = require('tiny-conf');
var fetch = require('node-fetch');

var refresh = require('./refresh');
var urlHelper = require('./util/url-helper');
var validate = require('./util/validate');
var KevoreeRegistryError = require('./util/KevoreeRegistryError');


var USER_LOGIN = ['login', 'password'];

function doValidate(params, definition) {
  return function doValidateProcess() {
    try {
      validate(params, definition);
    } catch (err) {
      throw new KevoreeRegistryError('Requested User is not valid (' + err.message + ')');
    }
  };
}

/**
 *
 * @param {Object} user { login: String, password: String }
 * @returns {Promise}
 */
function auth(params) {
  var url = urlHelper(
    config.get('registry.host'),
    config.get('registry.port'),
    config.get('registry.ssl')
  );

  var clientSecret = config.get('registry.oauth.client_secret') ||
    'kevoree_registryapp_secret';
  var clientId = config.get('registry.oauth.client_id') ||
    'kevoree_registryapp';

  return {
    login: function () {
      return Promise.resolve()
        .then(doValidate(params, USER_LOGIN))
        .then(function () {
          if (config.get('auth.access_token')) {
            if (config.get('auth.expires_at') <= Math.floor(new Date().getTime() / 1000)) {
              // we are logged in but the access_token is expired: refresh it
              return refresh()
                .then(function () {
                  // refresh succes => we are logged in
                  return true;
                })
                .catch(function () {
                  // refresh failed => not logged in
                  return false;
                });
            }
          }
          // not logged in
          return false;
        })
        .then(function (alreadyLoggedIn) {
          if (!alreadyLoggedIn) {
            // try to log in
            var data = 'username=' + params.login +
              '&password=' + params.password +
              '&grant_type=password' +
              '&scope=read%20write' +
              '&client_secret=' + clientSecret +
              '&client_id=' + clientId;

            var fetchData = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data),
                'Accept': 'application/json',
                'Authorization': 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64')
              },
              body: data,
              mode: 'no-cors',
              credentials: true
            };

            console.log(fetchData);

            return fetch(
              url + '/oauth/token', fetchData
            ).then(function (resp) {
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
        });
    },
    logout: function () {
      return Promise.resolve()
        .then(function () {
          return fetch(
            url + '/api/logout', {
              method: 'POST',
              headers: {
                'Accept': 'application/json'
              },
              mode: 'cors'
            }
          );
        })
        .then(function (resp) {
          if (resp.status === 200) {
            config.set('auth', {});
          } else {
            throw new KevoreeRegistryError(resp.statusText, resp.status);
          }
        });
    }
  };
}

module.exports = auth;
