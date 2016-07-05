var api = require('../index');
var expect = require('expect');
var nconf = require('nconf');

nconf.use('file', {
  file: 'test/config.json'
});

describe('Tdef test', function () {
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

  it('should get WSGroup/1.0.0 precisely', function (done) {
    api.tdef({
        namespace: 'kevoree',
        name: 'WSGroup',
        version: '1.0.0'
      })
      .get()
      .then(function (tdef) {
        expect(tdef).toExist();
        expect(tdef.name).toEqual('WSGroup');
        expect(tdef.version).toEqual('1.0.0');
        expect(tdef.namespace.name).toEqual('kevoree');
        done();
      })
      .catch(done);
  });

  it('should create a new FakeType/1.2.3 in the "kevoree" namespace', function () {
    return api.tdef({
        namespace: 'kevoree',
        name: 'FakeType',
        version: '1.2.3',
        model: '{}'
      })
      .create();
  });

  it('should delete FakeType/1.2.3 in the "kevoree" namespace', function () {
    return api.tdef({
        namespace: 'kevoree',
        name: 'FakeType',
        version: '1.2.3',
        model: '{}'
      })
      .delete();
  });
});
