"use strict";

const ora = require("ora");
require("dotenv").config();

// Load connect Mongoose
const conn = require("../lib/connectMongoose");
const mongoose = require("mongoose");

// Load Products Schema
const productModel = require("../models/Product");
const userModel = require("../models/User");

// Load utils
const dropCollection = require("./dropCollection");
const readJSON = require("./readJSON");

// Load mockup data path
const products = process.env.INITIAL_PRODUCTS;
const users = process.env.INITIAL_USERS;

async function drop() {
  let productDrop = dropCollection("Product");
  let userDrop = dropCollection("User");
  await Promise.all([productDrop, userDrop]);
}

async function seedCollection(model, json) {
  try {
    let data = await readJSON(json);
    let promises = [];
    for (const properties of data) {
      const instance = new model(properties);
      let instanceSaved = instance.save();
      promises.push(instanceSaved);
    }
    await Promise.all(promises);
  } catch (error) {
    console.log(error);
  }
}

async function seedCollectionInsert() {
  try {
    let modelSeed = productModel.insertMany(products);
    let userSeed = userModel.insertMany(users);
    await Promise.all([modelSeed, userSeed]);
  } catch (error) {
    console.log(error);
  }
}

async function seed() {
  let userSeed = seedCollection(userModel, users);
  let productSeed = seedCollection(productModel, products);
  await Promise.all([productSeed, userSeed]);
}

async function installDB() {
  const spinner = ora("Drop").start();
  await drop();
  spinner.succeed("Drop");
  spinner.start("Seed");
  await seed();
  spinner.succeed("Seed");
  spinner.start("Create admin");
  const adminProperties = {
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: process.env.ADMIN_ROLE
  };
  const admin = new userModel(adminProperties);
  await admin.save();
  spinner.succeed("Create admin");
  await conn.close();
}

conn.once("open", () => {
  installDB()
    .then(() => {
      console.log("InstallDB - Success");
      process.exit(0);
    })
    .catch(err => {
      console.log("InstallDB - Error:");
      console.log(err);
      process.exit(1);
    });
});
