'use strict';

var Q = require('q');
var nconf = require('kevoree-nconf');

/**
 *
 * @returns {Q.Promise}
 */
function refresh() {
  var clientSecret = nconf.get('registry:oauth:client_secret'),
    clientId = nconf.get('registry:oauth:client_id'),
    host = nconf.get('registry:host'),
    port = nconf.get('registry:port'),
    refreshToken = nconf.get('auth:refresh_token');

  var http;
  if (nconf.get('registry:ssl')) {
    http = require('https');
  } else {
    http = require('http');
  }

  return Q.Promise(function (resolve, reject, notify) {
    var data = 'grant_type=refresh_token&refresh_token=' + refreshToken;

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
        var resMsg;
        if (res.statusCode === 200) {
          try {
            var auth = JSON.parse(respData);
            auth.expires_at = Math.floor(new Date().getTime() / 1000) + auth.expires_in;
            delete auth.expires_in;
            nconf.set('auth', auth);
            resolve();
          } catch (ignore) {
            resolve({ code: res.statusCode, message: res.statusMessage });
          }
        } else {
          var err;
          try {
            resMsg = JSON.parse(respData);
            err = new Error(resMsg.message);
            err.code = res.statusCode;
            reject(err);
          } catch (ignore) {
            err = new Error(res.statusMessage);
            err.code = res.statusCode;
            reject(err);
          }
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

module.exports = refresh;
