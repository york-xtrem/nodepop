"use strict";

async function basePath(docs, path, property) {
  for (const doc of docs) {
    //   Not working hasOwnProperty
    // if (doc.hasOwnProperty(property)) {
    doc[property] = path + doc[property];
    // }
  }
}

module.exports = basePath;
