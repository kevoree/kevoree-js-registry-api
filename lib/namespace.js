'use strict';

var Q = require('q');
var nconf = require('nconf');
var urlTpl = require('url-template');
var responseHelper = require('./util/response-helper');

/**
 * @param {Object} params
 * @returns {Q.Promise}
 */
function namespace(params) {
  var config = nconf.argv().env(),
    host = config.get('registry:host'),
    port = config.get('registry:port'),
    token = config.get('user:access_token');

  var http = require(config.get('registry:ssl') ? 'https' : 'http');

  return {
    get: function () {
      return Q.Promise(function (resolve, reject, notify) {
        if (!params.name) {
          reject(new Error('Given params must define "name"'));
        }

        var options = {
          host: host,
          port: port,
          path: urlTpl.parse('/api/namespaces/{name}').expand(params),
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
            responseHelper(200, respData, res, resolve, reject);
          });
        });

        req.on('error', reject);
        req.end();
      });
    },
    create: function () {
      return Q.Promise(function (resolve, reject, notify) {
        if (!params.name) {
          reject(new Error('Given params must define "name"'));
        }

        var data = JSON.stringify({
          name: params.name
        });

        var options = {
          host: host,
          port: port,
          path: '/api/namespaces',
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
      });
    },
    delete: function () {
      return Q.Promise(function (resolve, reject, notify) {
        if (!params.name) {
          reject(new Error('Given params must define "name"'));
        }

        var options = {
          host: host,
          port: port,
          path: urlTpl.parse('/api/namespaces/{name}').expand(params),
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
            responseHelper(200, respData, res, resolve, reject);
          });
        });

        req.on('error', reject);
        req.end();
      });
    }
  };
}

module.exports = namespace;
