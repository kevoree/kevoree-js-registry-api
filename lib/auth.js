'use strict';

var Q = require('q');
var nconf = require('nconf');

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

  return {
    login: function () {
      return Q.Promise(function (resolve, reject, notify) {
        if (!params.login || !params.password) {
          reject(new Error('Given params must define "login" and "password"'));
        }

        var data = 'username=' + params.login +
          '&password=' + params.password +
          '&grant_type=password' +
          '&scope=read%20write' +
          '&client_secret=' + clientSecret +
          '&client_id=' + clientId;

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
                config.set('user', JSON.parse(respData));
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
    },
    logout: function () {
      return Q.Promise(function (resolve, reject, notify) {
        var options = {
          host: host,
          port: port,
          path: '/api/logout',
          method: 'POST',
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
            var resMsg;
            if (res.statusCode === 200) {
              try {
                config.set('user', {});
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
        req.end();
      });
    }
  };
}

module.exports = auth;
