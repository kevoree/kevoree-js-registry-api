'use strict';

var api = require('../index');
var expect = require('expect');
var nconf = require('nconf');

nconf.use('file', {
  file: 'test/config.json'
});

describe('Refresh test', function () {
  this.timeout(500);

  beforeEach(function () {
    return api.auth({
        login: 'kevoree',
        password: 'kevoree'
      })
      .login();
  });

  it('should refresh the user token', function (done) {
    api.refresh()
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
