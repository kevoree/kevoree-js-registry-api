'use strict';

var api = require('../index');
var expect = require('expect');
var nconf = require('nconf');

nconf.use('file', {
  file: 'test/config.json'
});

describe('Auth test', function () {
  this.timeout(500);

  it('should auth the user "kevoree"', function (done) {
    api.auth({
        login: 'kevoree',
        password: 'kevoree'
      })
      .then(function (oauth) {
        expect(oauth.access_token).toExist();
        expect(oauth.token_type).toExist();
        expect(oauth.refresh_token).toExist();
        expect(oauth.expires_in).toBeLessThanOrEqualTo(1800);
        expect(oauth.scope).toEqual('read write');
        done();
      })
      .catch(done);
  });
});
