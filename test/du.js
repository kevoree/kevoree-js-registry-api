'use strict';

var api = require('../index');
var expect = require('expect');
var nconf = require('kevoree-nconf');

nconf.use('file', {
  file: 'test/config.json'
});

describe('DeployUnit test', function () {
  this.timeout(1000);

  beforeEach(function () {
    return api.auth({
        login: 'kevoree',
        password: 'kevoree'
      })
      .login();
  });

  it('should get kevoree.WSGroup/1 kevoree-group-ws/1.0.0/js precisely', function (done) {
    api.du({
        name: 'kevoree-group-ws',
        version: '1.0.0',
        platform: 'js',
        typeDefinition: {
          name: 'WSGroup',
          version: 1,
          namespace: {
            'name': 'kevoree'
          }
        }
      })
      .get()
      .then(function (du) {
        expect(du).toExist();
        expect(du.name).toEqual('kevoree-group-ws');
        expect(du.version).toEqual('1.0.0');
        expect(du.platform).toEqual('js');
        expect(du.typeDefinition.name).toEqual('WSGroup');
        expect(du.typeDefinition.version).toEqual(1);
        expect(du.typeDefinition.namespace.name).toEqual('kevoree');
        done();
      })
      .catch(done);
  });

  it('should create a new kevoree.WSGroup/1 groupws/1.0.0/atari', function (done) {
    api.du({
        name: 'groupws',
        version: '1.0.0',
        platform: 'atari',
        typeDefinition: {
          name: 'WSGroup',
          version: 1,
          namespace: {
            'name': 'kevoree'
          }
        }
      })
      .delete()
      .finally(function () {
        api.du({
            name: 'groupws',
            version: '1.0.0',
            platform: 'atari',
            model: '{}',
            typeDefinition: {
              name: 'WSGroup',
              version: 1,
              namespace: {
                'name': 'kevoree'
              }
            }
          })
          .create()
          .then(function () {
            done();
          })
          .catch(done);
      });
  });

  it('should update kevoree.WSGroup/1 groupws/0.1.0-alpha/gameboy with new model {"foo": 42}', function (done) {
    api.du({
        name: 'groupws',
        version: '0.1.0-alpha',
        platform: 'gameboy',
        model: '{}',
        typeDefinition: {
          name: 'WSGroup',
          version: 1,
          namespace: {
            'name': 'kevoree'
          }
        }
      })
      .create()
      .then(function (du) {
        du.model = '{"foo": 42}';
        return api.du(du)
          .update();
      })
      .then(function (res) {
        expect(res.model).toEqual('{"foo": 42}');
        done();
      })
      .catch(done);
  });

  it('should delete kevoree.WSGroup/1 groupws/1.0.0/atari', function () {
    return api.du({
        name: 'groupws',
        version: '1.0.0',
        platform: 'atari',
        typeDefinition: {
          name: 'WSGroup',
          version: 1,
          namespace: {
            'name': 'kevoree'
          }
        }
      })
      .delete();
  });

  it('should return 404 when unknown namespace', function (done) {
    api.du({
        typeDefinition: {
          name: 'WSGroup',
          version: 1,
          namespace: {
            'name': 'unknownnamespace'
          }
        },
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
        typeDefinition: {
          name: 'Unknown',
          version: 1,
          namespace: {
            'name': 'kevoree'
          }
        },
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
        typeDefinition: {
          name: 'WSGroup',
          version: 42,
          namespace: {
            'name': 'kevoree'
          }
        },
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
        typeDefinition: {
          name: 'WSGroup',
          version: 1,
          namespace: {
            'name': 'kevoree'
          }
        },
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

  it('should delete kevoree.WSGroup/1 groupws/1.0.0/gameboy', function () {
    return api.du({
        name: 'groupws',
        version: '0.1.0-alpha',
        platform: 'gameboy',
        typeDefinition: {
          name: 'WSGroup',
          version: 1,
          namespace: {
            'name': 'kevoree'
          }
        }
      })
      .delete();
  });
});
