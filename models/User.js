"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const salt = parseInt(process.env.BCRYPT_SALT_ROUNDS);
const maxLoginAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS);
const lockTime = parseInt(process.env.LOCK_TIME);

/**
 * User Schema
 *
 * TODO:
 * - max/minlenght for string and password
 */
const userSchema = mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    index: true,
    required: true,
    match: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  },
  password: { type: String, index: true, required: true },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number }
});

/**
 * check for a future lockUntil timestamp
 */
userSchema.virtual("isLocked").get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

/**
 * Hash password before save
 */
userSchema.pre("save", function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(salt, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

/**
 * Compare password
 */
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

/**
 * Helper Login Attempts
 */
userSchema.methods.incLoginAttempts = function(callback) {
  // if we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.update(
      {
        $set: { loginAttempts: 1 },
        $unset: { lockUntil: 1 }
      },
      callback
    );
  }
  // otherwise we're incrementing
  var updates = { $inc: { loginAttempts: 1 } };
  // lock the account if we've reached max attempts and it's not locked already
  if (this.loginAttempts + 1 >= maxLoginAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  return this.update(updates, callback);
};

/**
 * Expose enum on the model, and provide an internal convenience reference
 */
var reasons = (userSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2
});

/**
 * Helper for Authenticated
 */
userSchema.statics.getAuthenticated = function(username, password, callback) {
  this.findOne({ username: username }, function(err, user) {
    if (err) return callback(err);

    // make sure the user exists
    if (!user) {
      return callback(null, null, reasons.NOT_FOUND);
    }

    // check if the account is currently locked
    if (user.isLocked) {
      // just increment login attempts if account is already locked
      return user.incLoginAttempts(function(err) {
        if (err) return callback(err);
        return callback(null, null, reasons.MAX_ATTEMPTS);
      });
    }

    // test for a matching password
    user.comparePassword(password, function(err, isMatch) {
      if (err) return callback(err);

      // check if the password was a match
      if (isMatch) {
        // if there's no lock or failed attempts, just return the user
        if (!user.loginAttempts && !user.lockUntil) return callback(null, user);
        // reset attempts and lock info
        var updates = {
          $set: { loginAttempts: 0 },
          $unset: { lockUntil: 1 }
        };
        return user.update(updates, function(err) {
          if (err) return callback(err);
          return callback(null, user);
        });
      }

      // password is incorrect, so increment login attempts before responding
      user.incLoginAttempts(function(err) {
        if (err) return callback(err);
        return callback(null, null, reasons.PASSWORD_INCORRECT);
      });
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
