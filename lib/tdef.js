'use strict';

var Q = require('q');
var nconf = require('nconf');
var urlTpl = require('url-template');
var Joi = require('joi');
var responseHelper = require('./util/response-helper');
var Schema = require('./util/schema');

/**
 *
 * @param {Object} params
 * @returns {Q.Promise}
 */
function tdef(params) {
  var config = nconf.argv().env(),
    host = nconf.get('registry:host'),
    port = nconf.get('registry:port'),
    token = nconf.get('auth:access_token');

  var http = require(nconf.get('registry:ssl') ? 'https' : 'http');

  return {
    get: function () {
      return Q.Promise(function (resolve, reject, notify) {
        Joi.validate(params, Schema.TypeDefinition.READ, function (err) {
          if (err) {
            reject(new Error('TypeDefinition not valid: ' + err.message));
          } else {
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
          }
        });
      });
    },
    create: function () {
      return Q.Promise(function (resolve, reject, notify) {
        Joi.validate(params, Schema.TypeDefinition.WRITE, function (err) {
          if (err) {
            reject(new Error('TypeDefinition not valid: ' + err.message));
          } else {
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
          }
        });
      });
    },
    delete: function () {
      return Q.Promise(function (resolve, reject, notify) {
        Joi.validate(params, Schema.TypeDefinition.READ, function (err) {
          if (err) {
            reject(new Error('TypeDefinition not valid: ' + err.message));
          } else {
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
          }
        });
      });
    },
    latest: function () {
      return Q.Promise(function (resolve, reject, notify) {
        Joi.validate(params, Schema.TypeDefinition.LATEST, function (err) {
          if (err) {
            reject(new Error('TypeDefinition not valid: ' + err.message));
          } else {
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
          }
        });
      });
    }
  };
}

module.exports = tdef;
