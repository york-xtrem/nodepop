"use strict";

const express = require("express");
const router = express.Router();
var assert = require("assert");
const jwtAuth = require("../../lib/jwtAuth");

// Load Products Schema
const Product = require("../../models/Product");

router.use(jwtAuth());

/**
 * GET /products
 * Get list Products
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

    // const rows = await Product.list(filter, limit, skip, sort, fields);
    const rows = await Product.find().exec();
    res.json({ success: true, result: rows });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /products:id
 * Get product
 */
router.get("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    const product = await Product.findOne({ _id: _id }).exec();
    res.json({ success: true, result: product });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /products
 * Create a product
 */
router.post("/", (req, res, next) => {
  // Create a product in memory
  const product = new Product(req.body);

  product.save((err, productSaved) => {
    if (err) {
      next(err);
      return;
    }

    res.json({ success: true, result: productSaved });
  });
});

/**
 * PUT /products
 * Update a product
 */
router.put("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    const data = req.body;
    const productUpdated = await Product.findOneAndUpdate({ _id: _id }, data, {
      new: true,
      runValidators: true
    }).exec();
    res.json({ success: true, result: productUpdated });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /products
 * Delete a product
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    await Product.remove({ _id: _id }).exec();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
