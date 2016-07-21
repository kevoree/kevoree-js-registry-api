'use strict';

var Q = require('q');
var nconf = require('kevoree-nconf');
var urlTpl = require('url-template');
var responseHelper = require('./util/response-helper');

/**
 *
 * @param {String} namespace name
 * @returns {Q.Promise}
 */
function tdefs(namespace) {
  var host = nconf.get('registry:host'),
    port = nconf.get('registry:port');

  var http = require(nconf.get('registry:ssl') ? 'https' : 'http');

  var path = '/api/tdefs';
  if (namespace) {
    path = '/api/namespaces/{namespace}/tdefs';
  }

  return Q.Promise(function (resolve, reject, notify) {
    var options = {
      host: host,
      port: port,
      path: urlTpl.parse(path).expand({ namespace: namespace }),
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
