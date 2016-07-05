var api = require('../index');
var expect = require('expect');
var nconf = require('nconf');

nconf.use('file', {
  file: 'test/config.json'
});

describe('Whoami test', function () {
  this.timeout(2000);

  beforeEach(function (done) {
    api.auth({
        login: 'kevoree',
        password: 'kevoree'
      })
      .then(function (oauth) {
        nconf.set('user:token', oauth.access_token);
        done();
      })
      .catch(done);
  });

  it('should answer "kevoree"', function (done) {
    api.whoami()
      .then(function (user) {
        expect(user).toEqual('kevoree');
        done();
      })
      .catch(done);
  });
});
