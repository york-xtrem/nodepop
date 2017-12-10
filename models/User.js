"use strict";

const mongoose = require("mongoose");

/**
 * User Schema
 *
 * TODO:
 * - max/minlenght for string
 * - max/min for number
 */
const userSchema = mongoose.Schema({
  name: { type: String },
  email: { type: Number, lowercase: true, unique: true, index: true },
  password: { type: String }
});

const User = mongoose.model("User", agenteSchema);

module.exports = User;
