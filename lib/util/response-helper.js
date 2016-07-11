'use strict';

module.exports = function (code, respData, res, resolve, reject, skipJsonParsing) {
  if (code.constructor !== Array) {
    code = [ code ];
  }
  var jsonRes;
  if (code.indexOf(res.statusCode) !== -1) {
    if (skipJsonParsing) {
      resolve(respData);
    } else {
      try {
        jsonRes = JSON.parse(respData);
        resolve(jsonRes);
      } catch (ignore) {
        resolve({ code: res.statusCode, message: res.statusMessage });
      }
    }
  } else {
    var err;
    try {
      jsonRes = JSON.parse(respData);
      err = new Error(jsonRes.message);
      err.code = res.statusCode;
      reject(err);
    } catch (ignore) {
      err = new Error(res.statusMessage);
      err.code = res.statusCode;
      reject(err);
    }
  }
};
