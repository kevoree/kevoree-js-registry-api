'use strict';

var api = require('../index');
var expect = require('expect');
var config = require('tiny-conf');

config.merge(require('./config.json'));

describe('DeployUnits test', function () {
  this.timeout(2000);

  it('should answer with all the deployUnits', function (done) {
    api.dus()
      .then(function (dus) {
        expect(dus).toExist();
        expect(dus.length).toBeMoreThan(0);
        done();
      })
      .catch(done);
  });

  it('should answer with all the deployUnits from namespace "kevoree"', function (done) {
    api.dus('kevoree')
      .then(function (dus) {
        dus.forEach(function (du) {
          expect(du.typeDefinition.namespace.name).toEqual('kevoree');
        });
        done();
      })
      .catch(done);
  });

  it('should answer with all the deployUnits from namespace "kevoree" with tdefName "WSGroup"', function (done) {
    api.dus('kevoree', 'WSGroup')
      .then(function (dus) {
        dus.forEach(function (du) {
          expect(du.typeDefinition.namespace.name).toEqual('kevoree');
          expect(du.typeDefinition.name).toEqual('WSGroup');
        });
        done();
      })
      .catch(done);
  });

  it('should answer with all the deployUnits from namespace "kevoree" with tdefName "WSGroup" and tdefVersion "1"', function (done) {
    api.dus('kevoree', 'WSGroup', 1)
      .then(function (dus) {
        dus.forEach(function (du) {
          expect(du.typeDefinition.namespace.name).toEqual('kevoree');
          expect(du.typeDefinition.name).toEqual('WSGroup');
          expect(du.typeDefinition.version).toEqual(1);
        });
        done();
      })
      .catch(done);
  });

  it('should answer with all the deployUnits from namespace "kevoree" with tdefName "WSGroup" and tdefVersion "1" and duName "kevoree-group-ws"', function (done) {
    api.dus('kevoree', 'WSGroup', 1, 'kevoree-group-ws')
      .then(function (dus) {
        dus.forEach(function (du) {
          expect(du.typeDefinition.namespace.name).toEqual('kevoree');
          expect(du.typeDefinition.name).toEqual('WSGroup');
          expect(du.typeDefinition.version).toEqual(1);
          expect(du.name).toEqual('kevoree-group-ws');
        });
        done();
      })
      .catch(done);
  });

  it('should answer with all the deployUnits from namespace "kevoree" with tdefName "WSGroup" and tdefVersion "1" and duName "kevoree-group-ws" and duVersion "1.0.0"', function (done) {
    api.dus('kevoree', 'WSGroup', 1, 'kevoree-group-ws', '1.0.0')
      .then(function (dus) {
        dus.forEach(function (du) {
          expect(du.typeDefinition.namespace.name).toEqual('kevoree');
          expect(du.typeDefinition.name).toEqual('WSGroup');
          expect(du.typeDefinition.version).toEqual(1);
          expect(du.name).toEqual('kevoree-group-ws');
          expect(du.version).toEqual('1.0.0');
        });
        done();
      })
      .catch(done);
  });
});
