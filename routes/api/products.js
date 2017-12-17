"use strict";

const express = require("express");
const router = express.Router();
const jwtAuth = require("../../lib/jwtAuth");

// Load Products Schema
const Product = require("../../models/Product");

// Load filter: range number
const filterRangeNumber = require("../../utils/filterRangeNumber");

// Helper for path
const basePath = require("../../utils/basePath");

const parseError = require("../../lib/parseError");

router.use(jwtAuth());

/**
 * GET /products
 * Get list Products
 */
router.get("/", async (req, res, next) => {
  try {
    // Create query empty
    const query = {};

    const name = req.query.name;
    if (name) query.name = new RegExp("^" + name, "i");

    const sale = req.query.sale;
    if (sale) query.sale = sale;

    const tags = req.query.tags;
    if (tags) query.tags = { $all: tags };

    const price = req.query.price;
    if (price) query.price = filterRangeNumber(price);

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

    const offset = parseInt(req.query.offset);
    if (offset) options.offset = offset;

    const skip = parseInt(req.query.skip);
    if (skip) options.skip = skip;

    const result = await Product.paginate(query, options);
    if (result.page < result.pages) {
      await basePath(result.docs, "images/products/", "photo");
    } else {
      throw new Error("You have exceeded the number of pages");
    }
    res.json({ success: true, result: result });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /products:id
 * Get product
 */
router.get("/tags", async (req, res, next) => {
  try {
    const tags = Product.tags();
    res.json({ success: true, result: tags });
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
      // console.log(JSON.stringify(err.errors));
      // let json = JSON.stringify(err.errors);
      parseError(err.errors);
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
