"use strict";

// Load connect Mongoose
const conn = require("../lib/connectMongoose");
const mongoose = require("mongoose");

// Load Products Schema
const productModel = require("../models/Product");
const userModel = require("../models/User");

// Load utils
const dropCollection = require("./dropCollection");

// Load mockup data
const products = require("../test/mockupData/MOCK_PRODUCT.json");
const users = require("../test/mockupData/MOCK_USER.json");

// Load mockup data with errors
const productsWithErrors = require("../test/mockupData/MOCK_PRODUCT-withErrors.json");

async function drop() {
  let productDrop = dropCollection("Product");
  let userDrop = dropCollection("User");
  await Promise.all([productDrop, userDrop]);
}

async function seed() {
  try {
    let modelSeed = productModel.insertMany(products);
    let userSeed = userModel.insertMany(users);
    await Promise.all([modelSeed, userSeed]);
  } catch (error) {
    console.log(error);
  }
}

async function installDB() {
  await drop();
  await seed();
  await conn.close();
}

installDB()
  .then(() => {
    console.log("InstallDB - Success");
    process.exit(0);
  })
  .catch(err => {
    console.log("InstallDB - Error: ", err);
    process.exit(1);
  });
