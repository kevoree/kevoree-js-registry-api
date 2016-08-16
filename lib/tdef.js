'use strict';

var Q = require('q');
var config = require('tiny-conf');
var urlTpl = require('url-template');
var responseHelper = require('./util/response-helper');
var validate = require('./util/validate');

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

/**
 *
 * @param {Object} params
 * @returns {Q.Promise}
 */
function tdef(params) {
  var host = config.get('registry.host'),
    port = config.get('registry.port'),
    token = config.get('auth.access_token');

  var http;
  if (config.get('registry.ssl')) {
    http = require('https');
  } else {
    http = require('http');
  }

  return {
    get: function () {
      return Q.Promise(function (resolve, reject, notify) {
        try {
          validate(params, TDEF_READ);
          var options = {
            host: host,
            port: port,
            path: urlTpl
              .parse('/api/namespaces/{namespace}/tdefs/{name}/{version}')
              .expand({
                namespace: params.namespace.name,
                name: params.name,
                version: params.version
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
                  err.message = params.namespace.name + '.' + params.name +
                      '/' + params.version + '/' + ' ' + err.message;
                }
                reject(err);
              });
            });
          });

          req.on('error', reject);
          req.end();
        } catch (err) {
          reject(new Error('TypeDefinition not valid ' + err.message));
        }
      });
    },
    create: function () {
      return Q.Promise(function (resolve, reject, notify) {
        try {
          validate(params, TDEF_CREATE);
          var data = JSON.stringify({
            name: params.name,
            version: params.version,
            model: params.model
          });

          var options = {
            host: host,
            port: port,
            path: urlTpl.parse('/api/namespaces/{namespace}/tdefs')
                        .expand({ namespace: params.namespace.name }),
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
          reject(new Error('TypeDefinition not valid ' + err.message));
        }
      });
    },
    delete: function () {
      return Q.Promise(function (resolve, reject, notify) {
        try {
          validate(params, TDEF_READ);
          var options = {
            host: host,
            port: port,
            path: urlTpl
              .parse('/api/namespaces/{namespace}/tdefs/{name}/{version}')
              .expand({
                namespace: params.namespace.name,
                name: params.name,
                version: params.version
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
                  err.message = params.namespace.name + '.' + params.name +
                      '/' + params.version + '/' + ' ' + err.message;
                }
                reject(err);
              });
            });
          });

          req.on('error', reject);
          req.end();
        } catch (err) {
          reject(new Error('TypeDefinition not valid ' + err.message));
        }
      });
    },
    latest: function () {
      return Q.Promise(function (resolve, reject, notify) {
        try {
          validate(params, TDEF_LATEST);
          var options = {
            host: host,
            port: port,
            path: urlTpl
              .parse('/api/namespaces/{namespace}/tdef/{name}/latest')
              .expand({
                namespace: params.namespace.name,
                name: params.name
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
                  err.message = params.namespace.name + '.' + params.name +
                      ' ' + err.message;
                }
                reject(err);
              });
            });
          });

          req.on('error', reject);
          req.end();
        } catch (err) {
          reject(new Error('TypeDefinition not valid ' + err.message));
        }
      });
    }
  };
}

module.exports = tdef;
