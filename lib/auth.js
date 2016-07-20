'use strict';

var Q = require('q');
var nconf = require('nconf');

var refresh = require('./refresh');

/**
 *
 * @param {Object} user { login: String, password: String }
 * @returns {Q.Promise}
 */
function auth(params) {
  var clientSecret = nconf.get('registry:oauth:client_secret'),
      clientId = nconf.get('registry:oauth:client_id'),
      host = nconf.get('registry:host'),
      port = nconf.get('registry:port');

  var http = require(nconf.get('registry:ssl') ? 'https':'http');

  return {
    login: function () {
      return Q.Promise(function (resolve, reject, notify) {
        if (!params.login || !params.password) {
          reject(new Error('Given params must define "login" and "password"'));
        }

        if (nconf.get('auth:access_token')) {
          if (nconf.get('auth:expires_at') > Math.floor(new Date().getTime() / 1000)) {
            // we are still logged in
            resolve();
          } else {
            // we are not logged in but we can refresh
            refresh().then(resolve).catch(reject);
          }
        } else {
          // not logged in & cant refresh
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
        }
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
                nconf.set('auth', {});
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
