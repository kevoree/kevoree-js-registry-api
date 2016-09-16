'use strict';

var config = require('tiny-conf');
var urlTpl = require('./util/url-template');
var fetch = require('node-fetch');

var urlHelper = require('./util/url-helper');
var KevoreeRegistryError = require('./util/KevoreeRegistryError');

/**
 *
 * @param {String} namespace optional
 * @param {String} tdefName optional
 * @param {String} tdefVersion optional
 * @param {String} name optional
 * @param {String} version optional
 * @returns {Promise}
 */
function dus(namespace, tdefName, tdefVersion, name, version) {
  var url = urlHelper(
    config.get('registry.host'),
    config.get('registry.port'),
    config.get('registry.ssl')
  );

  var path = '/api/dus';
  if (namespace) {
    if (tdefName) {
      if (tdefVersion) {
        if (name) {
          if (version) {
            path = '/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/dus/{name}/{version}';
          } else {
            path = '/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/dus/{name}';
          }
        } else {
          path = '/api/namespaces/{namespace}/tdefs/{tdefName}/{tdefVersion}/dus';
        }
      } else {
        path = '/api/namespaces/{namespace}/tdefs/{tdefName}/dus';
      }
    } else {
      path = '/api/namespaces/{namespace}/dus';
    }
  } else {
    path = '/api/dus';
  }

  return Promise.resolve()
    .then(function () {
      return fetch(
        url + urlTpl.parse(path).expand({
          namespace: namespace,
          tdefName: tdefName,
          tdefVersion: tdefVersion,
          name: name,
          version: version
        }),
        {
          headers: {
            'Accept': 'application/json'
          },
          mode: 'cors'
        }
      );
    })
    .then(function (resp) {
      if (resp.status === 200) {
        return resp.json();
      } else {
        return resp.json()
          .then(function (json) {
            throw new KevoreeRegistryError(json.message, resp.status);
          });
      }
    });
}

module.exports = dus;
