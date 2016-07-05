var Q = require('q');
var nconf = require('nconf');
var responseHelper = require('./util/response-helper');

/**
 *
 * @returns {Q.Promise}
 */
function refresh() {
  var config = nconf.argv().env(),
    clientSecret = config.get('oauth:client_secret'),
    clientId = config.get('oauth:client_id'),
    host = config.get('registry:host'),
    port = config.get('registry:port'),
    refreshToken = config.get('user:refresh_token');

  var http = require(config.get('registry:ssl') ? 'https' : 'http');

  return Q.Promise(function (resolve, reject, notify) {
    var data = "grant_type=refresh_token&refresh_token=" + refreshToken;

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

    var req = https.request(options, function (res) {
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
    req.write('\n');

    req.end();
  });
}

module.exports = refresh;
