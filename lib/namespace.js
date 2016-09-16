'use strict';

var config = require('tiny-conf');
var urlTpl = require('./util/url-template');
var fetch = require('node-fetch');

var urlHelper = require('./util/url-helper');
var validate = require('./util/validate');
var KevoreeRegistryError = require('./util/KevoreeRegistryError');

function doValidate(params, definition) {
  return function doValidateProcess() {
    try {
      validate(params, definition);
    } catch (err) {
      throw new KevoreeRegistryError('Requested Namespace is not valid (' + err.message + ')');
    }
  };
}

/**
 * @param {Object} params
 * @returns {Promise}
 */
function namespace(params) {
  var url = urlHelper(
    config.get('registry.host'),
    config.get('registry.port'),
    config.get('registry.ssl')
  );

  return {
    get: function () {
      return Promise.resolve()
        .then(doValidate(params, ['name']))
        .then(function () {
          return fetch(
            url + urlTpl.parse('/api/namespaces/{name}').expand(params),
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
            throw new KevoreeRegistryError('Namespace "' + params.name + '" ' +
              resp.statusText.toLowerCase(), resp.status);
          }
        });
    },
    create: function () {
      return Promise.resolve()
        .then(doValidate(params, ['name']))
        .then(function () {
          var data = JSON.stringify({
            name: params.name
          });

          return fetch(
            url + '/api/namespaces',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + config.get('auth.access_token')
              },
              body: data,
              mode: 'no-cors'
            }
          );
        })
        .then(function (resp) {
          if (resp.status === 201) {
            return resp.json();
          } else {
            throw new KevoreeRegistryError('Namespace "' + params.name + '" ' +
              resp.statusText.toLowerCase(), resp.status);
          }
        });
    },
    delete: function () {
      return Promise.resolve()
        .then(doValidate(params, ['name']))
        .then(function () {
          return fetch(
            url + urlTpl.parse('/api/namespaces/{name}').expand(params),
            {
              method: 'DELETE',
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
            return resp.statusText;
          } else {
            return resp.json().then(function (json) {
              throw new KevoreeRegistryError(json.message, resp.status);
            });
          }
        });
    }
  };
}

module.exports = namespace;
