"use strict";

const conn = require("../lib/connectMongoose");
const mongoose = require("mongoose");
const User = require("../models/User");
const fs = require("fs-extra");
const map = require("async/map");
const async = require("async");

const users = require("../test/mockupData/MOCK_USER.json");

mongoose.Promise = global.Promise;

async function saveCustom(properties) {
  try {
    console.log("Nueva instancia");
    const instance = new User(properties);
    // await instance.save((err, instanceSaved) => {
    //   if (err) {
    //     console.log("ERROR al guardar");
    //     console.log(err);
    //     next(err);
    //     return;
    //   }
    //   console.log("Instancia:");
    //   console.log(instanceSaved);
    // });
    await instance.save();
  } catch (error) {
    console.log("ERROR Map");
    console.log(error);
  }
}

function saveMany(array, model) {
  console.log("ANTES: array.map");
  //   return array.map(saveCustom(properties));
  return async.map(array, saveCustom, function(err, results) {
    // results is now an array of stats for each file
  });
}

function readJSON(jsonPath) {
  console.log("READJSON");
  return fs.readJson(jsonPath);
}

async function main() {
  try {
    console.log("Empiezo a leer");
    let json = await readJSON("../test/mockupData/MOCK_USER.json");

    await saveMany(json);
    // await async.map(json, saveCustom, function(err, results) {
    //   // results is now an array of stats for each file
    // });
    console.log("Termino SAVEMANY");
  } catch (error) {
    console.log("Error SAVEMANY");
    console.log(error);
  }
}

// main()
//   .then(() => {
//     console.log("OK MAIN");
//   })
//   .catch(error => {
//     console.log("Error Main");
//     console.log(error);
//   });
