'use strict';

var Q = require('q');
var config = require('tiny-conf');
var urlTpl = require('url-template');
var responseHelper = require('./util/response-helper');

/**
 *
 * @param {String} namespace optional
 * @param {String} tdefName optional
 * @param {String} tdefVersion optional
 * @param {String} name optional
 * @param {String} version optional
 * @returns {Q.Promise}
 */
function dus(namespace, tdefName, tdefVersion, name, version) {
  var host = config.get('registry.host'),
    port = config.get('registry.port');

  var http;
  if (config.get('registry.ssl')) {
    http = require('https');
  } else {
    http = require('http');
  }

  var path = '/api/dus';
  if (namespace) {
    if (tdefName) {
      if (tdefVersion) {
        if (name) {
          if (version) {
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

  return Q.Promise(function (resolve, reject, notify) {
    var options = {
      host: host,
      port: port,
      path: urlTpl.parse(path).expand({
        namespace: namespace,
        tdefName: tdefName,
        tdefVersion: tdefVersion,
        name: name,
        version: version
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
        responseHelper(200, respData, res, resolve, reject);
      });
    });

    req.on('error', reject);
    req.end();
  });
}

module.exports = dus;
