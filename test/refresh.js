var api = require('../index');
var expect = require('expect');
var nconf = require('nconf');

nconf.use('file', {
  file: 'test/config.json'
});

describe('Refresh test', function () {
  this.timeout(2000);

  beforeEach(function (done) {
    api.auth({
        login: 'kevoree',
        password: 'kevoree'
      })
      .then(function (oauth) {
        nconf.set('user:token', oauth.access_token);
        nconf.set('user:refresh_token', oauth.refresh_token);
        done();
      })
      .catch(done);
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
