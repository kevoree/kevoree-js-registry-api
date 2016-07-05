var https = require('https');
var Q = require('q');
var config = require('./util/config');

/**
 *
 * @param {String} namespace
 * @param {String} [name]
 * @param {String} [version]
 * @returns {Q.Promise}
 */
function getTdefs(namespace, name, version) {
    var path = '';
    if (namespace) {
        path += '/' + namespace;
    }
    if (name) {
        path += '/' + name;
    }
    if (version) {
        path += '/' + version;
    }

    var options = {
        hostname: config['host'],
        port:     config['port'],
        path: '/api/tdefs' + path,
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
        withCredentials: false // CORS
    };

    return Q.Promise(function (resolve, reject, notify) {
        var req = https.request(options, function (res) {
            var respData = '';
            res.on('data', function (data) {
                notify(data);
                respData += data;
            });

            res.on('end', function () {
                if (res.statusCode === 200) {
                    try {
                        if (respData.length > 0) {
                            resolve([].concat(JSON.parse(respData)));
                        } else {
                            resolve([]);
                        }
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

module.exports = getTdefs;