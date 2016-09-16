'use strict';

var api = require('../index');
var expect = require('expect');
var config = require('tiny-conf');

config.merge(require('./config.json'));

describe('Namespace test', function () {
  this.timeout(2000);

  beforeEach(function () {
    return api.auth({
        login: 'kevoree',
        password: 'kevoree'
      })
      .login();
  });

  it('should get namespace "kevoree"', function () {
    return api.namespace({
        name: 'kevoree'
      })
      .get()
      .then(function (namespace) {
        expect(namespace).toExist();
        expect(namespace.name).toEqual('kevoree');
        expect(namespace.owner.login).toEqual('kevoree');
        expect(namespace.members.length).toBeMoreThan(0);
      });
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
    api.auth()
      .logout()
      .then(function () {
        return api
          .namespace({
            name: 'wontwork'
          })
          .create();
      })
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
