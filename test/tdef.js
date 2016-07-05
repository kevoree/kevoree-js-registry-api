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

  it('should return 404 on unknown tdef Yolo/8.5.9 in "foo"', function (done) {
    api.tdef({
        namespace: 'foo',
        name: 'Yolo',
        version: '8.5.9'
      })
      .get()
      .catch(function (err) {
        expect(err).toExist();
        expect(err.code).toEqual(404);
        done();
      });
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

  it('should return 403 when not member of namespace', function (done) {
    api.tdef({
        namespace: 'user',
        name: 'WontHappen',
        version: '1.2.3',
        model: '{}'
      })
      .create()
      .catch(function (err) {
        expect(err).toExist();
        expect(err.code).toEqual(403);
        done();
      });
  });

  it('should return 401 when not authenticated', function (done) {
    // forget user:token => not connected
    nconf.set('user:token', 'wontwork');

    api.tdef({
        namespace: 'user',
        name: 'WontHappen',
        version: '1.2.3',
        model: '{}'
      })
      .create()
      .catch(function (err) {
        expect(err).toExist();
        expect(err.code).toEqual(401);
        done();
      });
  });

  it('should return 404 when namespace does not exist', function (done) {
    api.tdef({
        namespace: 'yolo',
        name: 'WontHappen',
        version: '1.2.3',
        model: '{}'
      })
      .create()
      .catch(function (err) {
        expect(err).toExist();
        expect(err.code).toEqual(404);
        done();
      });
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
