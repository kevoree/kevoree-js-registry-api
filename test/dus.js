'use strict';

var api = require('../index');
var expect = require('expect');
var config = require('tiny-conf');

config.merge(require('./config.json'));

describe('DeployUnits test', function () {
  this.timeout(2000);

  it('should answer with all the deployUnits', function () {
    return api.dus()
      .then(function (dus) {
        expect(dus).toExist();
        expect(dus.length).toBeMoreThan(0);
      });
  });

  it('should answer with all the deployUnits from namespace "kevoree"', function () {
    return api.dus('kevoree')
      .then(function (dus) {
        dus.forEach(function (du) {
          expect(du.typeDefinition.namespace.name).toEqual('kevoree');
        });
      });
  });

  it('should answer with all the deployUnits from namespace "kevoree" with tdefName "WSGroup"', function () {
    return api.dus('kevoree', 'WSGroup')
      .then(function (dus) {
        dus.forEach(function (du) {
          expect(du.typeDefinition.namespace.name).toEqual('kevoree');
          expect(du.typeDefinition.name).toEqual('WSGroup');
        });
      });
  });

  it('should answer with all the deployUnits from namespace "kevoree" with tdefName "WSGroup" and tdefVersion "1"', function () {
    return api.dus('kevoree', 'WSGroup', 1)
      .then(function (dus) {
        dus.forEach(function (du) {
          expect(du.typeDefinition.namespace.name).toEqual('kevoree');
          expect(du.typeDefinition.name).toEqual('WSGroup');
          expect(du.typeDefinition.version).toEqual(1);
        });
      });
  });

  it('should answer with all the deployUnits from namespace "kevoree" with tdefName "WSGroup" and tdefVersion "1" and duName "kevoree-group-ws"', function () {
    return api.dus('kevoree', 'WSGroup', 1, 'kevoree-group-ws')
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
    return api.dus('kevoree', 'WSGroup', 1, 'kevoree-group-ws', '1.0.0')
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
    return api.dus('doesnotexist')
      .then(function (dus) {
        expect(dus).toEqual([]);
      });
  });

  it('should return 404 for namespace "kevoree" with unknown tdefName "NopeThatDoesNotExist" and tdefVersion "911"', function (done) {
    api.dus('kevoree', 'NopeThatDoesNotExist', 911)
      .catch(function (err) {
        expect(err).toExist();
        done();
      });
  });
});
