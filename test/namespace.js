'use strict';

var api = require('../index');
var expect = require('expect');
var nconf = require('nconf');

nconf.use('file', {
  file: 'test/config.json'
});

describe('Namespace test', function () {
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

  it('should get namespace "kevoree"', function (done) {
    api.namespace({
        name: 'kevoree'
      })
      .get()
      .then(function (namespace) {
        expect(namespace).toExist();
        expect(namespace.name).toEqual('kevoree');
        expect(namespace.owner.login).toEqual('kevoree');
        expect(namespace.members.length).toBeMoreThan(0);
        done();
      })
      .catch(done);
  });

  it('should return 404 on unknown namespace "yoloswag"', function (done) {
    api.namespace({
        name: 'yoloswag'
      })
      .get()
      .catch(function (err) {
        expect(err).toExist();
        expect(err.code).toEqual(404);
        done();
      });
  });

  it('should create a new "yolo" namespace', function () {
    return api.namespace({
        name: 'yolo'
      })
      .create();
  });

  it('should return 401 when not authenticated', function (done) {
    // forget user:token => not connected
    nconf.set('user:token', 'wontwork');

    api.namespace({
        name: 'wontwork'
      })
      .create()
      .catch(function (err) {
        expect(err).toExist();
        expect(err.code).toEqual(401);
        done();
      });
  });

  it('should return 400 when namespace name is already taken', function (done) {
    api.namespace({
        name: 'kevoree'
      })
      .create()
      .catch(function (err) {
        expect(err).toExist();
        expect(err.code).toEqual(400);
        done();
      });
  });

  it('should return 400 on wrong tdef structure', function (done) {
    api.namespace({
        name: '&"invalidname=)!'
      })
      .create()
      .catch(function (err) {
        expect(err).toExist();
        expect(err.code).toEqual(400);
        done();
      });
  });

  it('should delete the "yolo" namespace', function () {
    return api.namespace({
        name: 'yolo'
      })
      .delete();
  });
});
