'use strict';

var Q = require('q');
var nconf = require('nconf');
var responseHelper = require('./util/response-helper');

/**
 *
 * @param {Object} params
 * @returns {Q.Promise}
 */
function dus(params) {
  var config = nconf.argv().env(),
    host = config.get('registry:host'),
    port = config.get('registry:port');

  var http = require(config.get('registry:ssl') ? 'https' : 'http');

  var path = '/api/dus';
  if (params) {
    if (params.namespace) {
      if (params.tdefName) {
        if (params.tdefVersion) {
          if (params.name) {
            if (params.version) {
              path = '/api/namespaces/'+params.namespace+'/tdefs/'+params.tdefName+'/'+params.tdefVersion+'/dus/'+params.name+'/'+params.version;
            } else {
              path = '/api/namespaces/'+params.namespace+'/tdefs/'+params.tdefName+'/'+params.tdefVersion+'/dus/'+params.name;
            }
          } else {
            path = '/api/namespaces/'+params.namespace+'/tdefs/'+params.tdefName+'/'+params.tdefVersion+'/dus';
          }
        } else {
          path = '/api/namespaces/'+params.namespace+'/tdefs/'+params.tdefName+'/dus';
        }
      } else {
        path = '/api/namespaces/'+params.namespace+'/dus';
      }
    } else {
      path = '/api/dus';
    }
  }

  return Q.Promise(function (resolve, reject, notify) {
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
        responseHelper(200, respData, res, resolve, reject);
      });
    });

    req.on('error', reject);
    req.end();
  });
}

module.exports = dus;
