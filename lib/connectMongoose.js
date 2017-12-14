"use strict";

const mongoose = require("mongoose");
const conn = mongoose.connection;

// Build the connection string
const dbURI = "mongodb://localhost/nodepop";
// TODO
// const connection = mongoose.createConnection(`mongodb://${process.env.MONGO_URI}`);

mongoose.Promise = global.Promise;

conn.on("error", err => {
  console.log("Error!", err);
  process.exit(1);
});

conn.once("open", () => {
  console.log(`Connect to MongoDB on ${mongoose.connection.name}`);
});

conn.on("close", function() {
  console.log(`Disconnect to MongoDB on ${mongoose.connection.name}`);
});

mongoose.connect(dbURI, {
  useMongoClient: true
});

module.exports = conn;
