'use strict';



module.exports = {
  parse: function urlTemplate(tpl) {
    return {
      expand: function (data) {
        Object.keys(data).forEach(function (key) {
          tpl = tpl.replace(new RegExp('{'+key+'}', 'g'), encodeURI(data[key]));
        });
        return tpl;
      }
    };
  }
};
