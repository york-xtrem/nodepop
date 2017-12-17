"use strict";

var express = require("express");
var router = express.Router();
const jwtAuth = require("../../lib/jwtAuth");

// Load Users Schema
const User = require("../../models/User");

// Custom validator for Users/Products
const ValidationErrorCustom = require("../../lib/validatorError");

// Control router
const checkRole = require("../../lib/checkRole");

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
      if (err.errors) {
        const errorCustom = new ValidationErrorCustom(err.errors);
        next(errorCustom);
      } else {
        next(err);
      }
      return;
    }
    res.json({ success: true, result: userSaved });
  });
});

router.use(jwtAuth());

/**
 * GET /users
 * Get list Users
 */
router.get("/", checkRole("Admin"), async (req, res, next) => {
  try {
    // Create query empty
    const query = {};

    const name = req.query.name;
    if (name) query.name = new RegExp("^" + name, "i");

    const email = req.query.email;
    if (email) query.email = email;

    const password = req.query.password;
    if (password) query.password = password;

    // Create options
    const options = {};

    // Select fields
    const select = req.query.select;
    if (select) options.select = select;

    const sort = req.query.sort;
    if (sort) options.sort = sort;

    // Lean: return plain javascript objects, not Mongoose Documents.
    const lean = req.query.lean;
    if (lean) options.lean = lean;
    const leanWithId = req.query.leanWithId;
    if (leanWithId) options.leanWithId = leanWithId;

    const limit = parseInt(req.query.limit);
    if (limit) options.limit = limit;

    const page = parseInt(req.query.page);
    if (page) options.page = page;

    // Use offset or page to set skip position
    const offset = parseInt(req.query.offset);
    if (offset) options.offset = offset;

    const result = await User.paginate(query, options);
    res.json({ success: true, result: result });
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
router.get("/:id", checkRole("Admin"), async (req, res, next) => {
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
 * PUT /users
 * Update a user
 */
// TODO: Mongoose middleware is not invoked on update() operations, so you must use a save() if you want to update user passwords.
// router.put("/:id", async (req, res, next) => {
router.put("/", async (req, res, next) => {
  try {
    // const _id = req.params.id;
    const _id = req.userId;
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
// router.delete("/:id", async (req, res, next) => {
router.delete("/", async (req, res, next) => {
  try {
    // const _id = req.params.id;
    const _id = req.userId;
    await User.remove({ _id: _id }).exec();
    res.json({ success: true });
  } catch (err) {
    const error = new Error(__("not_modified"));
    error.status = 304;
    next(error);
  }
});

module.exports = router;
