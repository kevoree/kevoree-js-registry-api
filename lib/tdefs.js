var Q = require('q');
var nconf = require('nconf');
var urlTpl = require('url-template');

/**
 *
 * @param {Object} params
 * @returns {Q.Promise}
 */
function tdefs(params) {
  var config = nconf.argv().env(),
    host = config.get('registry:host'),
    port = config.get('registry:port'),
    token = config.get('user:token');

  var http = require(config.get('registry:ssl') ? 'https' : 'http');

  var path = '/api/tdefs';
  if (params) {
    if (params.namespace) {
      path = urlTpl.parse('/api/namespaces/{namespace}/tdefs').expand({
        namespace: params.namespace
      });
    }
  }

  return Q.Promise(function (resolve, reject, notify) {
    var options = {
      host: host,
      port: port,
      path: path,
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
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(respData));
          } catch (err) {
            reject(err);
          }
        } else {
          try {
            respData = JSON.parse(respData);
            reject(respData);
          } catch (err) {
            reject(err);
          }
        }
      });
    });

    req.on('error', reject);

    req.end();
  });
}

module.exports = tdefs;
