"use strict";

var express = require("express");
var router = express.Router();

// Load Users Schema
const User = require("../../models/User");

/**
 * GET /users
 * Get list Users
 */
router.get("/", async (req, res, next) => {
  try {
    const name = req.query.name;
    const age = req.query.age;
    const limit = parseInt(req.query.limit); // Number(str)
    const skip = parseInt(req.query.skip);
    const sort = req.query.sort;
    const fields = req.query.fields;

    // Create filter empty
    const filter = {};

    if (name) {
      filter.name = name;
    }

    if (age) {
      filter.age = age;
    }

    // const rows = await User.list(filter, limit, skip, sort, fields);
    const rows = await User.find().exec();
    res.json({ success: true, result: rows });
  } catch (err) {
    next(err);
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
    next(err);
  }
});

/**
 * POST /users
 * Create a user
 */
router.post("/", (req, res, next) => {
  // Create a user in memory
  const user = new User(req.body);

  user.save((err, userSaved) => {
    if (err) {
      next(err);
      return;
    }

    res.json({ success: true, result: userSaved });
  });
});

/**
 * PUT /users
 * Update a user
 */
// TODO
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
    next(err);
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
    next(err);
  }
});

module.exports = router;
