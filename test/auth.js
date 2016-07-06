'use strict';

var api = require('../index');
var expect = require('expect');
var nconf = require('nconf');

nconf.use('file', {
  file: 'test/config.json'
});

describe('Auth test', function () {
  this.timeout(500);

  it('should log the user "kevoree in"', function (done) {
    api.auth({
        login: 'kevoree',
        password: 'kevoree'
      })
      .login()
      .then(function () {
        var user = nconf.get('user');
        expect(user.access_token).toExist();
        expect(user.token_type).toExist();
        expect(user.refresh_token).toExist();
        expect(user.expires_in).toBeLessThanOrEqualTo(1800);
        expect(user.scope).toEqual('read write');
        done();
      })
      .catch(done);
  });

  it('should log the current user out', function (done) {
    api.auth()
      .logout()
      .then(function () {
        var user = nconf.get('user');
        expect(user.access_token).toNotExist();
        expect(user.token_type).toNotExist();
        expect(user.refresh_token).toNotExist();
        expect(user.expires_in).toNotExist();
        expect(user.scope).toNotExist();
        done();
      })
      .catch(done);
  });
});
