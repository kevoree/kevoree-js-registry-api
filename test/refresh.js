'use strict';

var api = require('../index');
var expect = require('expect');
var config = require('tiny-conf');

config.merge(require('./config.json'));

describe('Refresh test', function () {
  this.timeout(2000);

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
});
