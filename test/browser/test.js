'use strict';

/* globals KevoreeRegistryApi, TinyConf, expect */

TinyConf.merge({
  'registry': {
    'host': 'localhost',
    'port': 8080,
    'ssl': false,
    'oauth': {
      'client_secret': 'kevoree_registryapp_secret',
      'client_id': 'kevoree_registryapp'
    }
  }
});

describe('Kevoree Registry API tests', function () {
  describe('TypeDefinitions', function () {
    this.timeout(2000);

    it('should get WSGroup/1 precisely', function () {
      return KevoreeRegistryApi.tdef({
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
      KevoreeRegistryApi.tdef({
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

    it('should get kevoree.Ticker/latest precisely', function () {
      KevoreeRegistryApi.tdef({
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
  });

  describe('DeployUnits', function () {
    it('should answer with all the deployUnits', function () {
      return KevoreeRegistryApi.dus()
        .then(function (dus) {
          expect(dus).toExist();
          expect(dus.length).toBeMoreThan(0);
        });
    });

    it('should answer with all the deployUnits from namespace "kevoree"', function () {
      return KevoreeRegistryApi.dus('kevoree')
        .then(function (dus) {
          dus.forEach(function (du) {
            expect(du.typeDefinition.namespace.name).toEqual('kevoree');
          });
        });
    });

    it('should answer with all the deployUnits from namespace "kevoree" with tdefName "WSGroup"', function () {
      return KevoreeRegistryApi.dus('kevoree', 'WSGroup')
        .then(function (dus) {
          dus.forEach(function (du) {
            expect(du.typeDefinition.namespace.name).toEqual('kevoree');
            expect(du.typeDefinition.name).toEqual('WSGroup');
          });
        });
    });

    it('should answer with all the deployUnits from namespace "kevoree" with tdefName "WSGroup" and tdefVersion "1"', function () {
      return KevoreeRegistryApi.dus('kevoree', 'WSGroup', 1)
        .then(function (dus) {
          dus.forEach(function (du) {
            expect(du.typeDefinition.namespace.name).toEqual('kevoree');
            expect(du.typeDefinition.name).toEqual('WSGroup');
            expect(du.typeDefinition.version).toEqual(1);
          });
        });
    });

    it('should answer with all the deployUnits from namespace "kevoree" with tdefName "WSGroup" and tdefVersion "1" and duName "kevoree-group-ws"', function () {
      return KevoreeRegistryApi.dus('kevoree', 'WSGroup', 1, 'kevoree-group-ws')
        .then(function (dus) {
          dus.forEach(function (du) {
            expect(du.typeDefinition.namespace.name).toEqual('kevoree');
            expect(du.typeDefinition.name).toEqual('WSGroup');
            expect(du.typeDefinition.version).toEqual(1);
            expect(du.name).toEqual('kevoree-group-ws');
          });
        });
    });

    it('should answer with all the deployUnits from namespace "kevoree" with tdefName "WSGroup" and tdefVersion "1" and duName "kevoree-group-ws" and duVersion "1.0.0"', function () {
      return KevoreeRegistryApi.dus('kevoree', 'WSGroup', 1, 'kevoree-group-ws', '1.0.0')
        .then(function (dus) {
          dus.forEach(function (du) {
            expect(du.typeDefinition.namespace.name).toEqual('kevoree');
            expect(du.typeDefinition.name).toEqual('WSGroup');
            expect(du.typeDefinition.version).toEqual(1);
            expect(du.name).toEqual('kevoree-group-ws');
            expect(du.version).toEqual('1.0.0');
          });
        });
    });

    it('should return an empty array for unknown namespace', function () {
      return KevoreeRegistryApi.dus('doesnotexist')
        .then(function (dus) {
          expect(dus).toEqual([]);
        });
    });

    it('should return 404 for namespace "kevoree" with unknown tdefName "NopeThatDoesNotExist" and tdefVersion "911"', function (done) {
      KevoreeRegistryApi.dus('kevoree', 'NopeThatDoesNotExist', 911)
        .catch(function (err) {
          expect(err).toExist();
          done();
        });
    });
  });
});
