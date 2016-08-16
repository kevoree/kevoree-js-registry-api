'use strict';

var Q = require('q');
var config = require('tiny-conf');
var responseHelper = require('./util/response-helper');

/**
 *
 * @returns {Q.Promise}
 */
function namespaces() {
  var host = config.get('registry.host'),
    port = config.get('registry.port');

  var http;
  if (config.get('registry.ssl')) {
    http = require('https');
  } else {
    http = require('http');
  }

  return Q.Promise(function (resolve, reject, notify) {
    var options = {
      host: host,
      port: port,
      path: '/api/namespaces',
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

module.exports = namespaces;
