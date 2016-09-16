'use strict';

module.exports = function urlHelper(host, port, ssl) {
  var protocol = 'http:';
  if (ssl) {
    protocol = 'https:';
  }
  if (port === 80) {
    port = '';
  } else if (port === 443) {
    port = '';
  } else {
    port = ':' + port;
  }
  return protocol + '//' + host + port;
};
