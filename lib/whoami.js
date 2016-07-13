'use strict';

var Q = require('q');
var nconf = require('nconf');
var responseHelper = require('./util/response-helper');

/**
 *
 * @returns {Q.Promise}
 */
function whoami() {
  var config = nconf.argv().env(),
    host = nconf.get('registry:host'),
    port = nconf.get('registry:port'),
    token = nconf.get('auth:access_token');

  var http = require(nconf.get('registry:ssl') ? 'https' : 'http');

  return Q.Promise(function (resolve, reject, notify) {
    var options = {
      host: host,
      port: port,
      path: '/api/authenticate',
      method: 'GET',
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
        responseHelper(200, respData, res, resolve, reject, true);
      });
    });

    req.on('error', reject);
    req.end();
  });
}

module.exports = whoami;
