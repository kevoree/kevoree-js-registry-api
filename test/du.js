'use strict';

var api = require('../index');
var expect = require('expect');
var nconf = require('nconf');

nconf.use('file', {
  file: 'test/config.json'
});

describe('DeployUnit test', function () {
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
