"use strict";

// Load connect Mongoose
const conn = require("../lib/connectMongoose");
const mongoose = require("mongoose");

function dropCollection(modelName) {
  if (!modelName || !modelName.length) {
    Promise.reject(new Error("You must provide the name of a model."));
  }

  try {
    var model = mongoose.model(modelName);
    var collection = conn.collections[model.collection.collectionName];
  } catch (err) {
    return Promise.reject(err);
  }

  return new Promise(function(resolve, reject) {
    collection.drop(function(err) {
      if (err && err.message != "ns not found") {
        reject(err);
        return;
      }

      // Remove mongoose's internal records of this
      // temp. model and the schema associated with it
      delete mongoose.models[modelName];
      // delete mongoose.connection.collections["products"];
      delete mongoose.modelSchemas[modelName];

      resolve();
    });
  });
}

module.exports = dropCollection;
