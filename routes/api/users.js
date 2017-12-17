"use strict";

var express = require("express");
var router = express.Router();

// Load Users Schema
const User = require("../../models/User");

const ValidationErrorCustom = require("../../lib/validatorError");

/**
 * GET /users
 * Get list Users
 */
router.get("/", async (req, res, next) => {
  try {
    const rows = await User.find().exec();
    res.json({ success: true, result: rows });
  } catch (err) {
    const error = new Error(__("not_found"));
    error.status = 404;
    next(error);
  }
});

/**
 * GET /users:id
 * Get user
 */
router.get("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    const user = await User.findOne({ _id: _id }).exec();
    res.json({ success: true, result: user });
  } catch (err) {
    const error = new Error(__("not_found"));
    error.status = 404;
    next(error);
  }
});

/**
 * POST /users
 * Create a user
 */
router.post("/", (req, res, next) => {
  // Create a user in memory
  const user = new User(req.body);
  console.log(user);
  user.save((err, userSaved) => {
    if (err) {
      const errorCustom = new ValidationErrorCustom(err.errors);
      next(errorCustom);
      return;
    }
    res.json({ success: true, result: userSaved });
  });
});

/**
 * PUT /users
 * Update a user
 */
// TODO: Mongoose middleware is not invoked on update() operations, so you must use a save() if you want to update user passwords.
router.put("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    const data = req.body;
    const userUpdated = await User.findOneAndUpdate({ _id: _id }, data, {
      new: true,
      runValidators: true
    }).exec();
    res.json({ success: true, result: userUpdated });
  } catch (err) {
    const error = new Error(__("not_modified"));
    error.status = 304;
    next(error);
  }
});

/**
 * DELETE /users
 * Delete a user
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    await User.remove({ _id: _id }).exec();
    res.json({ success: true });
  } catch (err) {
    const error = new Error(__("not_modified"));
    error.status = 304;
    next(error);
  }
});

module.exports = router;
