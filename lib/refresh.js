var https = require('https');
var Q = require('q');
var config = require('./util/config');

/**
 *
 * @param {String} refresh_token
 * @returns {Q.Promise}
 */
function refresh(refresh_token) {
    return Q.Promise(function (resolve, reject, notify) {
        var data = "grant_type=refresh_token&refresh_token=" + refresh_token;

        var options = {
            hostname: config['host'],
            port: config['port'],
            path: '/oauth/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data),
                'Accept': 'application/json',
                'Authorization': 'Basic ' + new Buffer(config.client_id + ':' + config.client_secret).toString('base64')
            }
        };

        var req = https.request(options, function (res) {
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

        req.write(data);
        req.write('\n');

        req.end();
    });
}

module.exports = refresh;