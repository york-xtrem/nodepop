"use strict";

const responseCustom = function(success, result, extra) {
  return { success, result, extra };
};

module.exports = responseCustom;
