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
function tdefs(params) {
  var config = nconf.argv().env(),
    host = config.get('registry:host'),
    port = config.get('registry:port');

  var http = require(config.get('registry:ssl') ? 'https' : 'http');

  var path = '/api/tdefs';
  if (params) {
    if (params.namespace) {
      path = '/api/namespaces/{namespace}/tdefs';
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

module.exports = tdefs;
