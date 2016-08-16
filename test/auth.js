'use strict';

var api = require('../index');
var expect = require('expect');
var config = require('tiny-conf');

config.merge(require('./config.json'));

console.warn('----------------------------------------------------------------------');
console.log();
console.warn('THOSE TESTS MUST BE RUN AGAINST THE DEV H2 DB OF THE KEVOREE REGISTRY');
console.warn('OTHERWISE THEY WILL FAIL. (yes I know it\'s kinda lame)');
console.log();
console.warn('----------------------------------------------------------------------');

describe('Auth test', function () {
  this.timeout(2000);

  it('should log the user "kevoree in"', function (done) {
    api.auth({
        login: 'kevoree',
        password: 'kevoree'
      })
      .login()
      .then(function () {
        var auth = config.get('auth');
        expect(auth.access_token).toExist();
        expect(auth.token_type).toExist();
        expect(auth.refresh_token).toExist();
        expect(auth.expires_at).toBeGreaterThanOrEqualTo(Math.floor(new Date().getTime() / 1000));
        expect(auth.scope).toEqual('read write');
        done();
      })
      .catch(done);
  });

  it('should log the current user out', function (done) {
    api.auth()
      .logout()
      .then(function () {
        var auth = config.get('auth');
        expect(auth.access_token).toNotExist();
        expect(auth.token_type).toNotExist();
        expect(auth.refresh_token).toNotExist();
        expect(auth.expires_at).toNotExist();
        expect(auth.scope).toNotExist();
        done();
      })
      .catch(done);
  });
});
