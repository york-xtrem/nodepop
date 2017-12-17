"use strict";

const fs = require("fs-extra");

function readJSON(jsonPath) {
  return fs.readJson(jsonPath);
}

module.exports = readJSON;
