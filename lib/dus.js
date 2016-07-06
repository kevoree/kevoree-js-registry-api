'use strict';

var Q = require('q');
var nconf = require('nconf');
var urlTpl = require('url-template');
var responseHelper = require('./util/response-helper');

/**
 *
 * @param {Object} params
 * @returns {Q.Promise}
 */
function dus(params) {
  var config = nconf.argv().env(),
    host = config.get('registry:host'),
    port = config.get('registry:port');

  var http = require(config.get('registry:ssl') ? 'https' : 'http');

  var path = '/api/dus';
  if (params) {
    if (params.namespace) {
      if (params.tdefName) {
        if (params.tdefVersion) {
          if (params.name) {
            if (params.version) {
              path = '/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/dus/{name}/{version}';
            } else {
              path = '/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/dus/{name}';
            }
          } else {
            path = '/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/dus';
          }
        } else {
          path = '/api/namespaces/{namespace}/tdefs/{tdefName}/dus';
        }
      } else {
        path = '/api/namespaces/{namespace}/dus';
      }
    } else {
      path = '/api/dus';
    }
  }

  return Q.Promise(function (resolve, reject, notify) {
    var options = {
      host: host,
      port: port,
      path: urlTpl.parse(path).expand(params),
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
}

module.exports = dus;
