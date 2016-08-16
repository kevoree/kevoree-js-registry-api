'use strict';

var api = require('../index');
var expect = require('expect');
var config = require('tiny-conf');

config.merge(require('./config.json'));

describe('Tdefs test', function () {
  this.timeout(2000);

  it('should answer with all the type definitions', function (done) {
    api.tdefs()
      .then(function (tdefs) {
        expect(tdefs).toExist();
        expect(tdefs.length).toBeMoreThan(0);
        done();
      })
      .catch(done);
  });

  it('should answer with the list of kevoree\'s type definitions', function (done) {
    api.tdefs('kevoree')
      .then(function (tdefs) {
        expect(tdefs).toExist();
        expect(tdefs.length).toBeMoreThan(0);
        done();
      })
      .catch(done);
  });
});
