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
      .then(function () {
        var auth = nconf.get('auth');
        expect(auth.access_token).toExist();
        expect(auth.token_type).toExist();
        expect(auth.refresh_token).toExist();
        expect(auth.expires_at).toBeGreaterThanOrEqualTo(Math.floor(new Date().getTime() / 1000));
        expect(auth.scope).toEqual('read write');
        done();
      })
      .catch(done);
  });
});
