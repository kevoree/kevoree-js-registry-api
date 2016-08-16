'use strict';

var api = require('../index');
var expect = require('expect');
var config = require('tiny-conf');

config.merge(require('./config.json'));

describe('Whoami test', function () {
  this.timeout(2000);

  it('should answer "kevoree"', function (done) {
    api.auth({
        login: 'kevoree',
        password: 'kevoree'
      })
      .login()
      .then(function () {
        return api.whoami();
      })
      .then(function (user) {
        expect(user).toEqual('kevoree');
        done();
      })
      .catch(done);
  });
});
