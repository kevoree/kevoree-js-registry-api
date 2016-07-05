var Q = require('q');
var nconf = require('nconf');
var urlTpl = require('url-template');

/**
 *
 * @param {Object} params
 * @returns {Q.Promise}
 */
function tdef(params) {
  var config = nconf.argv().env(),
    host = config.get('registry:host'),
    port = config.get('registry:port'),
    token = config.get('user:token');

  var http = require(config.get('registry:ssl') ? 'https' : 'http');

  return {
    get: function () {
      return Q.Promise(function (resolve, reject, notify) {
        if (!params.namespace || !params.name || !params.version) {
          reject(new Error('Given params must define "namespace", "name" and "version"'));
        }

        var path = urlTpl
          .parse('/api/namespaces/{namespace}/tdefs/{name}/{version}')
          .expand(params);

        var options = {
          host: host,
          port: port,
          path: path,
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
            if (res.statusCode === 200) {
              try {
                resolve(JSON.parse(respData));
              } catch (err) {
                reject(new Error('Unable to parse GET '+path+' response to JSON'));
              }
            } else {
              var err;
              try {
                var resMsg = JSON.parse(respData);
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
    },
    create: function () {
      return Q.Promise(function (resolve, reject, notify) {
        if (!params.namespace || !params.name || !params.version || !params.model) {
          reject(new Error('Given params must define "namespace", "name", "version" and "model"'));
        }

        var data = JSON.stringify({
          name: params.name,
          version: params.version,
          model: params.model
        });

        var path = urlTpl
          .parse('/api/namespaces/{namespace}/tdefs')
          .expand(params);

        var options = {
          host: host,
          port: port,
          path: path,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
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
            if (res.statusCode === 201) {
              resolve();
            } else {
              var err;
              try {
                var resMsg = JSON.parse(respData);
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
    delete: function () {
      return Q.Promise(function (resolve, reject, notify) {
        if (!params.namespace || !params.name || !params.version) {
          reject(new Error('Given params must define "namespace", "name" and "version"'));
        }

        var path = urlTpl
          .parse('/api/namespaces/{namespace}/tdefs/{name}/{version}')
          .expand(params);

        var options = {
          host: host,
          port: port,
          path: path,
          method: 'DELETE',
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
            if (res.statusCode === 200) {
              resolve();
            } else {
              var err;
              try {
                var resMsg = JSON.parse(respData);
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

module.exports = tdef;
