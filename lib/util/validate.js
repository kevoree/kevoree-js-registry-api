'use strict';

function find(obj, desc) {
    var props = desc.split('.');
    while (props.length && (obj = obj[props.shift()])) {}
    return obj;
}

function validateProp(obj, propName) {
  if (!find(obj, propName)) {
    throw new Error('missing \''+propName+'\' property');
  }
}


module.exports = function (obj, props) {
  props.forEach(function (prop) {
    validateProp(obj, prop);
  });
};
