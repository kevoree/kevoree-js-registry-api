'use strict';

var Q = require('q');
var nconf = require('kevoree-nconf');
var urlTpl = require('url-template');
var responseHelper = require('./util/response-helper');
var validate = require('./util/validate');

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
  'name',
  'typeDefinition.name', 'typeDefinition.version',
  'typeDefinition.namespace.name'
];

/**
 *
 * @param {Object} params
 * @returns {Q.Promise}
 */
function du(params) {
  var host = nconf.get('registry:host'),
    port = nconf.get('registry:port'),
    token = nconf.get('auth:access_token');

  var http;
  if (nconf.get('registry:ssl')) {
    http = require('https');
  } else {
    http = require('http');
  }

  return {
    get: function () {
      return Q.Promise(function (resolve, reject, notify) {
        try {
          validate(params, DU_READ);
          var options = {
            host: host,
            port: port,
            path: urlTpl.parse('/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/dus/{name}/{version}/{platform}')
              .expand({
                namespace: params.typeDefinition.namespace.name,
                tdefName: params.typeDefinition.name,
                tdefVersion: params.typeDefinition.version,
                name: params.name,
                version: params.version,
                platform: params.platform
              }),
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            }
          };

          var req = http.request(options, function (res) {
            var respData = '';
            res.on('data', function (data) {
              notify(data);
              respData += data;
            });

            res.on('end', function () {
              responseHelper(200, respData, res, resolve, function (err) {
                if (err.code === 404) {
                  err.message = params.typeDefinition.namespace.name + '.' +
                    params.typeDefinition.name + '/' +
                    params.typeDefinition.version + ' ' +
                    params.name + '/' + params.version + '/' +
                    params.platform + ' ' + err.message;
                }
                reject(err);
              });
            });
          });

          req.on('error', reject);
          req.end();
        } catch (err) {
          reject(new Error('DeployUnit not valid ' + err.message));
        }
      });
    },
    create: function () {
      return Q.Promise(function (resolve, reject, notify) {
        try {
          validate(params, DU_CREATE);
          var data = JSON.stringify({
            name: params.name,
            version: params.version,
            platform: params.platform,
            model: params.model
          });

          var options = {
            host: host,
            port: port,
            path: urlTpl.parse('/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/dus')
              .expand({
                namespace: params.typeDefinition.namespace.name,
                tdefName: params.typeDefinition.name,
                tdefVersion: params.typeDefinition.version
              }),
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(data),
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + token
            }
          };

          var req = http.request(options, function (res) {
            var respData = '';
            res.on('data', function (data) {
              notify(data);
              respData += data;
            });

            res.on('end', function () {
              responseHelper(201, respData, res, resolve, reject);
            });
          });

          req.on('error', reject);
          req.write(data);
          req.end();
        } catch (err) {
          reject(new Error('DeployUnit not valid ' + err.message));
        }
      });
    },
    delete: function () {
      return Q.Promise(function (resolve, reject, notify) {
        try {
          validate(params, DU_READ);
          var options = {
            host: host,
            port: port,
            path: urlTpl.parse('/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/dus/{name}/{version}/{platform}')
              .expand({
                namespace: params.typeDefinition.namespace.name,
                tdefName: params.typeDefinition.name,
                tdefVersion: params.typeDefinition.version,
                name: params.name,
                version: params.version,
                platform: params.platform
              }),
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + token
            }
          };

          var req = http.request(options, function (res) {
            var respData = '';
            res.on('data', function (data) {
              notify(data);
              respData += data;
            });

            res.on('end', function () {
              responseHelper(200, respData, res, resolve, function (err) {
                if (err.code === 404) {
                  err.message = params.typeDefinition.namespace.name + '.' +
                    params.typeDefinition.name + '/' +
                    params.typeDefinition.version + ' ' +
                    params.name + '/' + params.version + '/' +
                    params.platform + ' ' + err.message;
                }
                reject(err);
              });
            });
          });

          req.on('error', reject);
          req.end();
        } catch (err) {
          reject(new Error('DeployUnit not valid ' + err.message));
        }
      });
    },
    update: function () {
      return Q.Promise(function (resolve, reject, notify) {
        try {
          validate(params, DU_UPDATE);
          var data = JSON.stringify({
            id: params.id,
            name: params.name,
            version: params.version,
            platform: params.platform,
            model: params.model
          });

          var options = {
            host: host,
            port: port,
            path: urlTpl.parse('/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/dus/{name}/{version}/{platform}')
              .expand({
                namespace: params.typeDefinition.namespace.name,
                tdefName: params.typeDefinition.name,
                tdefVersion: params.typeDefinition.version,
                name: params.name,
                version: params.version,
                platform: params.platform
              }),
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(data),
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + token
            }
          };

          var req = http.request(options, function (res) {
            var respData = '';
            res.on('data', function (data) {
              notify(data);
              respData += data;
            });

            res.on('end', function () {
              responseHelper([200, 201], respData, res, resolve, function (err) {
                if (err.code === 404) {
                  err.message = params.typeDefinition.namespace.name + '.' +
                    params.typeDefinition.name + '/' +
                    params.typeDefinition.version + ' ' +
                    params.name + '/' + params.version + '/' +
                    params.platform + ' ' + err.message;
                }
                reject(err);
              });
            });
          });

          req.on('error', reject);
          req.write(data);
          req.end();
        } catch (err) {
          reject(new Error('DeployUnit not valid ' + err.message));
        }
      });
    },
    latest: function () {
      return Q.Promise(function (resolve, reject, notify) {
        try {
          validate(params, DU_LATEST);
          var path;
          if (params.platform) {
            path = urlTpl
              .parse('/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/latest-dus/{platform}')
              .expand({
                namespace: params.typeDefinition.namespace.name,
                tdefName: params.typeDefinition.name,
                tdefVersion: params.typeDefinition.version,
                platform: params.platform
              });
          } else {
            path = urlTpl
              .parse('/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/latest-dus')
              .expand({
                namespace: params.typeDefinition.namespace.name,
                tdefName: params.typeDefinition.name,
                tdefVersion: params.typeDefinition.version
              });
          }

          var options = {
            host: host,
            port: port,
            path: path,
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            }
          };

          var req = http.request(options, function (res) {
            var respData = '';
            res.on('data', function (data) {
              notify(data);
              respData += data;
            });

            res.on('end', function () {
              responseHelper(200, respData, res, resolve, function (err) {
                if (err.code === 404) {
                  err.message = params.typeDefinition.namespace.name + '.' +
                    params.typeDefinition.name + '/' +
                    params.typeDefinition.version + ' ' + err.message;
                }
                reject(err);
              });
            });
          });

          req.on('error', reject);
          req.end();
        } catch (err) {
          reject(new Error('DeployUnit not valid ' + err.message));
        }
      });
    },
    release: function () {
      return Q.Promise(function (resolve, reject, notify) {
        try {
          validate(params, DU_LATEST);
          var path;
          if (params.platform) {
            path = urlTpl
              .parse('/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/released-dus/{platform}')
              .expand({
                namespace: params.typeDefinition.namespace.name,
                tdefName: params.typeDefinition.name,
                tdefVersion: params.typeDefinition.version,
                platform: params.platform
              });
          } else {
            path = urlTpl
              .parse('/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/released-dus')
              .expand({
                namespace: params.typeDefinition.namespace.name,
                tdefName: params.typeDefinition.name,
                tdefVersion: params.typeDefinition.version
              });
          }

          var options = {
            host: host,
            port: port,
            path: path,
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            }
          };

          var req = http.request(options, function (res) {
            var respData = '';
            res.on('data', function (data) {
              notify(data);
              respData += data;
            });

            res.on('end', function () {
              responseHelper(200, respData, res, resolve, function (err) {
                if (err.code === 404) {
                  err.message = params.typeDefinition.namespace.name + '.' +
                    params.typeDefinition.name + '/' +
                    params.typeDefinition.version + ' ' +
                    params.platform + ' ' + err.message;
                }
                reject(err);
              });
            });
          });

          req.on('error', reject);
          req.end();
        } catch (err) {
          reject(new Error('DeployUnit not valid ' + err.message));
        }
      });
    }
  };
}

module.exports = du;
