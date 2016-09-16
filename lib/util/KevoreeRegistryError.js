'use strict';

var util = require('util');

function KevoreeRegistryError(message, code) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.code = code;
}

util.inherits(KevoreeRegistryError, Error);

module.exports = KevoreeRegistryError;
