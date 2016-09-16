'use strict';

var config = require('tiny-conf');
var urlTpl = require('./util/url-template');
var KevoreeRegistryError = require('./util/KevoreeRegistryError');
var urlHelper = require('./util/url-helper');
var validate = require('./util/validate');
var fetch = require('node-fetch');

var DU_READ = [
  'name', 'version', 'platform',
  'typeDefinition.name', 'typeDefinition.version',
  'typeDefinition.namespace.name'
];
var DU_CREATE = [
  'name', 'version', 'platform', 'model',
  'typeDefinition.name', 'typeDefinition.version',
  'typeDefinition.namespace.name'
];
var DU_UPDATE = [
  'id', 'name', 'version', 'platform', 'model',
  'typeDefinition.name', 'typeDefinition.version',
  'typeDefinition.namespace.name'
];
var DU_LATEST = [
  'typeDefinition.name', 'typeDefinition.version',
  'typeDefinition.namespace.name'
];

function doValidate(params, definition) {
  return function doValidateProcess() {
    try {
      validate(params, definition);
    } catch (err) {
      throw new KevoreeRegistryError('Requested DeployUnit is not valid (' + err.message + ')');
    }
  };
}

/**
 *
 * @param {Object} params
 * @returns {Promise}
 */
function du(params) {
  var url = urlHelper(
    config.get('registry.host'),
    config.get('registry.port'),
    config.get('registry.ssl')
  );

  return {
    get: function () {
      return Promise.resolve()
        .then(doValidate(params, DU_READ))
        .then(function () {
          return fetch(
            url + urlTpl.parse('/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/dus/{name}/{version}/{platform}')
              .expand({
                namespace: params.typeDefinition.namespace.name,
                tdefName: params.typeDefinition.name,
                tdefVersion: params.typeDefinition.version,
                name: params.name,
                version: params.version,
                platform: params.platform
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
            throw new KevoreeRegistryError('DeployUnit ' + params.typeDefinition.namespace.name + '.' +
              params.typeDefinition.name + '/' +
              params.typeDefinition.version + ' ' +
              params.name + '/' + params.version + '/' +
              params.platform + ' ' + resp.statusText.toLowerCase(), resp.status);
          }
        });
    },
    create: function () {
      return Promise.resolve()
        .then(doValidate(params, DU_CREATE))
        .then(function () {
          var data = JSON.stringify({
            name: params.name,
            version: params.version,
            platform: params.platform,
            model: params.model
          });

          return fetch(
            url + urlTpl.parse('/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/dus')
              .expand({
                namespace: params.typeDefinition.namespace.name,
                tdefName: params.typeDefinition.name,
                tdefVersion: params.typeDefinition.version
              }),
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
            throw new KevoreeRegistryError('DeployUnit ' + params.typeDefinition.namespace.name + '.' +
              params.typeDefinition.name + '/' +
              params.typeDefinition.version + ' ' +
              params.name + '/' + params.version + '/' +
              params.platform + ' ' + resp.statusText.toLowerCase(), resp.status);
          }
        });
    },
    delete: function () {
      return Promise.resolve()
        .then(doValidate(params, DU_READ))
        .then(function () {
          return fetch(
            url + urlTpl.parse('/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/dus/{name}/{version}/{platform}')
              .expand({
                namespace: params.typeDefinition.namespace.name,
                tdefName: params.typeDefinition.name,
                tdefVersion: params.typeDefinition.version,
                name: params.name,
                version: params.version,
                platform: params.platform
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
            throw new KevoreeRegistryError('DeployUnit ' + params.typeDefinition.namespace.name + '.' +
              params.typeDefinition.name + '/' +
              params.typeDefinition.version + ' ' +
              params.name + '/' + params.version + '/' +
              params.platform + ' ' + resp.statusText.toLowerCase(), resp.status);
          }
        });
    },
    update: function () {
      return Promise.resolve()
        .then(doValidate(params, DU_UPDATE))
        .then(function () {
          var data = JSON.stringify({
            id: params.id,
            name: params.name,
            version: params.version,
            platform: params.platform,
            model: params.model
          });

          return fetch(
            url + urlTpl.parse('/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/dus/{name}/{version}/{platform}')
              .expand({
                namespace: params.typeDefinition.namespace.name,
                tdefName: params.typeDefinition.name,
                tdefVersion: params.typeDefinition.version,
                name: params.name,
                version: params.version,
                platform: params.platform
              }),
            {
              method: 'PUT',
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
          if (resp.status === 200 || resp.status === 201) {
            return resp.json();
          } else {
            throw new KevoreeRegistryError('DeployUnit ' + params.typeDefinition.namespace.name + '.' +
              params.typeDefinition.name + '/' +
              params.typeDefinition.version + ' ' +
              params.name + '/' + params.version + '/' +
              params.platform + ' ' + resp.statusText.toLowerCase(), resp.status);
          }
        });
    },
    latest: function () {
      return Promise.resolve()
        .then(doValidate(params, DU_LATEST))
        .then(function () {
          if (params.platform) {
            url = url + urlTpl
              .parse('/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/latest-dus/{platform}')
              .expand({
                namespace: params.typeDefinition.namespace.name,
                tdefName: params.typeDefinition.name,
                tdefVersion: params.typeDefinition.version,
                platform: params.platform
              });
          } else {
            url = url + urlTpl
              .parse('/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/latest-dus')
              .expand({
                namespace: params.typeDefinition.namespace.name,
                tdefName: params.typeDefinition.name,
                tdefVersion: params.typeDefinition.version
              });
          }

          return fetch(
            url,
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
            throw new KevoreeRegistryError('DeployUnit ' + params.typeDefinition.namespace.name + '.' +
              params.typeDefinition.name + '/' +
              params.typeDefinition.version + ' ' + resp.statusText.toLowerCase(), resp.status);
          }
        });
    },
    release: function () {
      return Promise.resolve()
        .then(doValidate(params, DU_LATEST))
        .then(function () {
          if (params.platform) {
            url = url + urlTpl
              .parse('/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/released-dus/{platform}')
              .expand({
                namespace: params.typeDefinition.namespace.name,
                tdefName: params.typeDefinition.name,
                tdefVersion: params.typeDefinition.version,
                platform: params.platform
              });
          } else {
            url = url + urlTpl
              .parse('/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/released-dus')
              .expand({
                namespace: params.typeDefinition.namespace.name,
                tdefName: params.typeDefinition.name,
                tdefVersion: params.typeDefinition.version
              });
          }

          return fetch(
            url,
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
            throw new KevoreeRegistryError('DeployUnit ' + params.typeDefinition.namespace.name + '.' +
              params.typeDefinition.name + '/' +
              params.typeDefinition.version + ' ' +
              params.platform + ' ' + resp.statusText.toLowerCase(), resp.status);
          }
        });
    }
  };
}

module.exports = du;
