'use strict';

var api = require('../index');
var expect = require('expect');
var config = require('tiny-conf');

config.merge(require('./config.json'));

describe('Tdef test', function () {
  this.timeout(2000);

  beforeEach(function () {
    return api.auth({
        login: 'kevoree',
        password: 'kevoree'
      })
      .login();
  });

  it('should get WSGroup/1 precisely', function () {
    return api.tdef({
        namespace: { name: 'kevoree' },
        name: 'WSGroup',
        version: 1
      })
      .get()
      .then(function (tdef) {
        expect(tdef).toExist();
        expect(tdef.name).toEqual('WSGroup');
        expect(tdef.version).toEqual(1);
        expect(tdef.namespace.name).toEqual('kevoree');
      });
  });

  it('should return 404 on unknown tdef Yolo/8 in "foo"', function (done) {
    api.tdef({
        namespace: { name: 'foo' },
        name: 'Yolo',
        version: 8
      })
      .get()
      .catch(function (err) {
        expect(err).toExist();
        expect(err.code).toEqual(404);
        done();
      });
  });

  it('should create a new FakeType/1 in the "kevoree" namespace', function () {
    return api.tdef({
        namespace: { name: 'kevoree' },
        name: 'FakeType',
        version: 1,
        model: '{}'
      })
      .create();
  });

  it('should get kevoree.Ticker/latest precisely', function () {
    api.tdef({
        name: 'Ticker',
        namespace: { name: 'kevoree' }
      })
      .latest()
      .then(function (tdef) {
        expect(tdef).toExist();
        expect(tdef.name).toEqual('Ticker');
        expect(tdef.version).toEqual(3);
      });
  });

  it('should return 403 when not member of namespace', function (done) {
    api.tdef({
        namespace: { name: 'user' },
        name: 'WontHappen',
        version: 1,
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
    api.auth()
      .logout()
      .then(function () {
        return api.tdef({
          namespace: { name: 'user' },
          name: 'WontHappen',
          version: 1,
          model: '{}'
        }).create();
      })
      .catch(function (err) {
        expect(err).toExist();
        expect(err.code).toEqual(401);
        done();
      });
  });

  it('should return 404 when namespace does not exist', function (done) {
    api.tdef({
        namespace: { name: 'yolo' },
        name: 'WontHappen',
        version: 1,
        model: '{}'
      })
      .create()
      .catch(function (err) {
        expect(err).toExist();
        expect(err.code).toEqual(404);
        done();
      });
  });

  it('should forbid wrong tdef structure', function (done) {
    api.tdef({
        namespace: { name: 'kevoree' },
        name: 'mytype',
        version: 1,
        model: '{}'
      })
      .create()
      .catch(function (err) {
        expect(err).toExist();
        done();
      });
  });

  it('should delete FakeType/1 in the "kevoree" namespace', function () {
    return api.tdef({
        namespace: { name: 'kevoree' },
        name: 'FakeType',
        version: 1,
        model: '{}'
      })
      .delete();
  });
});
