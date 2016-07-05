var https = require('https');
var Q = require('q');
var config = require('./util/config');

/**
 *
 * @param {String} token
 * @param {String} namespace
 * @param {String} name
 * @param {String} version
 * @param {String} serializedModel
 * @returns {Q.Promise}
 */
module.exports = function createTdef(token, namespace, name, version, serializedModel) {
    return Q.Promise(function (resolve, reject, notify) {
        var data = JSON.stringify({
            namespace:       namespace,
            name:            name,
            version:         version,
            serializedModel: serializedModel
        });

        var options = {
            hostname: config['host'],
            port:     config['port'],
            path:     '/api/tdefs',
            method:   'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
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
                if (res.statusCode === 201) {
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

        req.write(data);
        req.write('\n');

        req.end();
    });
};