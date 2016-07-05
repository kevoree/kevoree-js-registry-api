var Q = require('q');
var nconf = require('nconf');
var responseHelper = require('./util/response-helper');


/**
 *
 * @param {Object} user { login: String, password: String }
 * @returns {Q.Promise}
 */
function auth(params) {
  var config = nconf.argv().env(),
      clientSecret = config.get('oauth:client_secret'),
      clientId = config.get('oauth:client_id'),
      host = config.get('registry:host'),
      port = config.get('registry:port');

  var http = require(config.get('registry:ssl') ? 'https':'http');

  return Q.Promise(function (resolve, reject, notify) {
    if (!params.login || !params.password) {
      reject(new Error('Given params must define "login" and "password"'));
    }

    var data = "username=" + params.login +
      "&password=" + params.password +
      "&grant_type=password" +
      "&scope=read%20write" +
      "&client_secret=" + clientSecret +
      "&client_id=" + clientId;

    var options = {
      host: host,
      port: port,
      path: '/oauth/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data),
        'Accept': 'application/json',
        'Authorization': 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64')
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
    req.write(data);
    req.end();
  });
}

module.exports = auth;
