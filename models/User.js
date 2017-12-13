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
  name: { type: String, trim: true, required: true },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    index: true,
    required: true
  },
  password: { type: String, index: true, required: true }
});

const User = mongoose.model("User", agenteSchema);

module.exports = User;
