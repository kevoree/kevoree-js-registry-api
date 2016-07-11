'use strict';

var api = require('../index');
var expect = require('expect');
var nconf = require('nconf');

nconf.use('file', {
  file: 'test/config.json'
});

describe('Namespaces test', function () {
  this.timeout(2000);

  it('should answer with all the namespaces', function (done) {
    api.namespaces()
      .then(function (namespaces) {
        expect(namespaces).toExist();
        expect(namespaces.length).toBeMoreThan(0);
        done();
      })
      .catch(done);
  });
});
