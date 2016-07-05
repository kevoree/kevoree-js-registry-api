var https = require('https');
var Q = require('q');
var config = require('./util/config');

/**
 *
 * @param {String} token
 * @param {String} namespace
 * @param {String} name
 * @param {String} version
 * @returns {Q.Promise}
 */
module.exports = function deleteTdef(token, namespace, name, version) {
    return Q.Promise(function (resolve, reject, notify) {
        var options = {
            hostname: config['host'],
            port:     config['port'],
            path: '/api/tdefs/'+namespace+'/'+name+(version ? '/'+version : ''),
            method: 'DELETE',
            headers: {
                'Accept':        'application/json',
                'Authorization': 'Bearer ' + token
            }
        };

        var req = https.request(options, function (res) {
            var respData = '';
            res.on('data', function (data) {
                notify(data);
                respData += data;
            });

            res.on('end', function () {
                if (res.statusCode === 200 || res.statusCode === 404) {
                    resolve();
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
};