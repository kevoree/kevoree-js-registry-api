'use strict';

var Joi = require('joi');

var SEMVER = /^([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?$/;

var User = {
  READ: Joi.object().keys({
    login: Joi.string().regex(/^[a-z0-9]*$/),
    password: Joi.string()
  }).unknown(),
  WRITE: Joi.object().keys({
    login: Joi.string().regex(/^[a-z0-9]*$/),
    password: Joi.string()
  }).unknown()
};

var Namespace = {
  READ: Joi.object().keys({
    name: Joi.string().regex(/^[a-z0-9]+(\.[a-z0-9]+)*$/)
  }).requiredKeys('name').unknown(),
  WRITE: Joi.object().keys({
    name: Joi.string().regex(/^[a-z0-9]+(\.[a-z0-9]+)*$/),
    owner: User.READ.unknown(),
    members: Joi.array().items(User.READ.unknown())
  }).requiredKeys('name', 'owner', 'members').unknown()
};

var TypeDefinition = {
  READ: Joi.object().keys({
    name: Joi.string().regex(/^[A-Z][\w]*$/),
    version: Joi.string().regex(SEMVER),
    namespace: Namespace.READ.unknown()
  }).requiredKeys('name', 'version', 'namespace').unknown(),
  WRITE: Joi.object().keys({
    id: Joi.number(),
    name: Joi.string().regex(/^[A-Z][\w]*$/),
    version: Joi.string().regex(SEMVER),
    model: Joi.string(),
    namespace: Namespace.READ.unknown()
  }).requiredKeys('name', 'version', 'model', 'namespace').unknown()
};

var DeployUnit = {
  READ: Joi.object().keys({
    name: Joi.string(),
    version: Joi.string().regex(SEMVER),
    platform: Joi.string().min(1).max(50),
    typeDefinition: TypeDefinition.READ.unknown()
  }).requiredKeys('name', 'version', 'platform', 'typeDefinition').unknown(),
  WRITE: Joi.object().keys({
    id: Joi.number(),
    name: Joi.string(),
    version: Joi.string().regex(SEMVER),
    platform: Joi.string().min(1).max(50),
    model: Joi.string(),
    typeDefinition: TypeDefinition.READ.unknown()
  }).requiredKeys('name', 'version', 'platform', 'model', 'typeDefinition').unknown()
};

exports.User = User;
exports.Namespace = Namespace;
exports.TypeDefinition = TypeDefinition;
exports.DeployUnit = DeployUnit;