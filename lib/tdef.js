'use strict';

var Q = require('q');
var nconf = require('nconf');
var responseHelper = require('./util/response-helper');

/**
 *
 * @param {Object} params
 * @returns {Q.Promise}
 */
function tdef(params) {
  var config = nconf.argv().env(),
    host = config.get('registry:host'),
    port = config.get('registry:port'),
    token = config.get('user:token');

  var http = require(config.get('registry:ssl') ? 'https' : 'http');

  return {
    get: function () {
      return Q.Promise(function (resolve, reject, notify) {
        if (!params.namespace || !params.name || !params.version) {
          reject(new Error('Given params must define "namespace", "name" and "version"'));
        }

        var options = {
          host: host,
          port: port,
          path: '/api/namespaces/'+params.namespace+'/tdefs/'+params.name+'/' + params.version,
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
        if (!params.namespace || !params.name || !params.version || !params.model) {
          reject(new Error('Given params must define "namespace", "name", "version" and "model"'));
        }

        var data = JSON.stringify({
          name: params.name,
          version: params.version,
          model: params.model
        });

        var options = {
          host: host,
          port: port,
          path: '/api/namespaces/'+params.namespace+'/tdefs',
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
        if (!params.namespace || !params.name || !params.version) {
          reject(new Error('Given params must define "namespace", "name" and "version"'));
        }

        var options = {
          host: host,
          port: port,
          path: '/api/namespaces/'+params.namespace+'/tdefs/'+params.name+'/'+params.version,
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

module.exports = tdef;
