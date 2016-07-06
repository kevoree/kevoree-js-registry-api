'use strict';

module.exports = function (code, respData, res, resolve, reject, skipJsonParsing) {
  var resMsg;
  if (res.statusCode === code) {
    if (skipJsonParsing) {
      resolve(respData);
    } else {
      try {
        resMsg = JSON.parse(respData);
        resolve(resMsg);
      } catch (ignore) {
        resolve({ code: res.statusCode, message: res.statusMessage });
      }
    }
  } else {
    var err;
    try {
      resMsg = JSON.parse(respData);
      err = new Error(resMsg.message);
      err.code = res.statusCode;
      reject(err);
    } catch (ignore) {
      err = new Error(res.statusMessage);
      err.code = res.statusCode;
      reject(err);
    }
  }
};
