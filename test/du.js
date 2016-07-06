'use strict';

var api = require('../index');
var expect = require('expect');
var nconf = require('nconf');

nconf.use('file', {
  file: 'test/config.json'
});

describe('DeployUnit test', function () {
  this.timeout(500);

  beforeEach(function () {
    return api.auth({
        login: 'kevoree',
        password: 'kevoree'
      })
      .login();
  });

  it('should get kevoree.WSGroup/1.0.0 kevoree-group-ws/1.0.0/js precisely', function (done) {
    api.du({
        namespace: 'kevoree',
        tdefName: 'WSGroup',
        tdefVersion: '1.0.0',
        name: 'kevoree-group-ws',
        version: '1.0.0',
        platform: 'js'
      })
      .get()
      .then(function (du) {
        expect(du).toExist();
        expect(du.name).toEqual('kevoree-group-ws');
        expect(du.version).toEqual('1.0.0');
        expect(du.platform).toEqual('js');
        expect(du.typeDefinition.name).toEqual('WSGroup');
        expect(du.typeDefinition.version).toEqual('1.0.0');
        expect(du.typeDefinition.namespace.name).toEqual('kevoree');
        done();
      })
      .catch(done);
  });

  it('should create a new kevoree.WSGroup/1.0.0 groupws/1.0.0/atari', function () {
    return api.du({
        namespace: 'kevoree',
        tdefName: 'WSGroup',
        tdefVersion: '1.0.0',
        name: 'groupws',
        version: '1.0.0',
        platform: 'atari',
        model: '{}'
      })
      .create();
  });

  it('should return 404 when unknown namespace', function (done) {
    api.du({
        namespace: 'unknownnamespace',
        tdefName: 'WSGroup',
        tdefVersion: '1.0.0',
        name: 'groupws',
        version: '1.0.0',
        platform: 'atari',
        model: '{}'
      })
      .create()
      .catch(function (err) {
        expect(err).toExist();
        expect(err.code).toEqual(404);
        done();
      });
  });

  it('should return 404 when unknown typeDef', function (done) {
    api.du({
        namespace: 'kevoree',
        tdefName: 'unknown',
        tdefVersion: '1.0.0',
        name: 'groupws',
        version: '1.0.0',
        platform: 'atari',
        model: '{}'
      })
      .create()
      .catch(function (err) {
        expect(err).toExist();
        expect(err.code).toEqual(404);
        done();
      });
  });

  it('should return 404 when unknown version', function (done) {
    api.du({
        namespace: 'kevoree',
        tdefName: 'WSGroup',
        tdefVersion: '1.0.8',
        name: 'groupws',
        version: '1.0.0',
        platform: 'atari',
        model: '{}'
      })
      .create()
      .catch(function (err) {
        expect(err).toExist();
        expect(err.code).toEqual(404);
        done();
      });
  });

  it('should not create when model is not given', function (done) {
    api.du({
        namespace: 'kevoree',
        tdefName: 'WSGroup',
        tdefVersion: '1.0.0',
        name: 'groupws',
        version: '1.0.0',
        platform: 'atari'
      })
      .create()
      .catch(function (err) {
        expect(err).toExist();
        done();
      });
  });

  it('should delete a new kevoree.WSGroup/1.0.0 groupws/1.0.0/atari', function () {
    return api.du({
        namespace: 'kevoree',
        tdefName: 'WSGroup',
        tdefVersion: '1.0.0',
        name: 'groupws',
        version: '1.0.0',
        platform: 'atari'
      })
      .delete();
  });
});
