'use strict';

var config = require('tiny-conf');
var urlTpl = require('./util/url-template');
var KevoreeRegistryError = require('./util/KevoreeRegistryError');
var urlHelper = require('./util/url-helper');
var validate = require('./util/validate');
var fetch = require('node-fetch');

var TDEF_READ = [
  'name', 'version',
  'namespace.name'
];
var TDEF_CREATE = [
  'name', 'version', 'model',
  'namespace.name'
];
var TDEF_LATEST = [
  'name',
  'namespace.name'
];

function doValidate(params, definition) {
  return function doValidateProcess() {
    try {
      validate(params, definition);
    } catch (err) {
      throw new KevoreeRegistryError('Requested TypeDefinition is not valid (' + err.message + ')');
    }
  };
}

/**
 *
 * @param {Object} params
 * @returns {Promise}
 */
function tdef(params) {
  var url = urlHelper(
    config.get('registry.host'),
    config.get('registry.port'),
    config.get('registry.ssl')
  );

  return {
    get: function () {
      return Promise.resolve()
        .then(doValidate(params, TDEF_READ))
        .then(function () {
          return fetch(
            url + urlTpl
              .parse('/api/namespaces/{namespace}/tdefs/{name}/{version}')
              .expand({
                namespace: params.namespace.name,
                name: params.name,
                version: params.version
              }),
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
            throw new KevoreeRegistryError(
              'TypeDefinition ' + params.namespace.name + '.' + params.name + '/' + params.version + ' ' + resp.statusText.toLowerCase(),
              resp.status
            );
          }
        });
    },
    create: function () {
      return Promise.resolve()
        .then(doValidate(params, TDEF_CREATE))
        .then(function () {
          var data = JSON.stringify({
            name: params.name,
            version: params.version,
            model: params.model
          });

          return fetch(
            url + urlTpl.parse('/api/namespaces/{namespace}/tdefs')
                        .expand({ namespace: params.namespace.name }),
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
            // TODO fix server so that it returns the newly created Tdef
            return resp.statusText;
          } else if (resp.status === 403) {
            return resp.json()
              .then(function (json) {
                throw new KevoreeRegistryError(
                  'Cannot create ' + params.namespace.name + '.' + params.name + '/' + params.version + ' (' + json.message + ')',
                  resp.status
                );
              });
          } else {
            throw new KevoreeRegistryError(
              'TypeDefinition ' + params.namespace.name + '.' + params.name + '/' + params.version + ' ' + resp.statusText.toLowerCase(),
              resp.status
            );
          }
        });
    },
    delete: function () {
      return Promise.resolve()
        .then(doValidate(params, TDEF_READ))
        .then(function () {
          return fetch(
            url + urlTpl
              .parse('/api/namespaces/{namespace}/tdefs/{name}/{version}')
              .expand({
                namespace: params.namespace.name,
                name: params.name,
                version: params.version
              }),
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
            throw new KevoreeRegistryError(
              'TypeDefinition ' + params.namespace.name + '.' + params.name + '/' + params.version + ' ' + resp.statusText.toLowerCase(),
              resp.status
            );
          }
        });
    },
    latest: function () {
      return Promise.resolve()
        .then(doValidate(params, TDEF_LATEST))
        .then(function () {
          return fetch(
            url + urlTpl
              .parse('/api/namespaces/{namespace}/tdef/{name}/latest')
              .expand({
                namespace: params.namespace.name,
                name: params.name
              }),
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
            throw new KevoreeRegistryError(
              'TypeDefinition ' + params.namespace.name + '.' + params.name + '/' + params.version + ' ' + resp.statusText.toLowerCase(),
              resp.status
            );
          }
        });
    }
  };
}

module.exports = tdef;
