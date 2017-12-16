"use strict";

const express = require("express");
const router = express.Router();
const jwtAuth = require("../../lib/jwtAuth");

// Load Products Schema
const Product = require("../../models/Product");

// Load filter: range number
const filterRangeNumber = require("../../utils/filterRangeNumber");

router.use(jwtAuth());

/**
 * GET /products
 * Get list Products
 */
router.get("/", async (req, res, next) => {
  try {
    const name = req.query.name;
    const sale = req.query.sale;
    const tags = req.query.tags;
    const price = req.query.price;

    // Create filter empty
    const filter = {};
    if (name) {
      filter.name = new RegExp("^" + name, "i");
    }

    if (sale) {
      filter.sale = sale;
    }

    if (tags) {
      filter.tags = { $all: tags };
    }

    if (price) {
      filter.price = filterRangeNumber(price);
    }
    console.log(filter);

    /**
     * Paginate from 0
     * Limit default: 10
     */
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit) || 10;
    let skip = parseInt(req.query.skip);
    if (Number.isInteger(page)) {
      // Skip rewrite for pagination
      skip = page * limit;
    }

    const sort = req.query.sort;
    const fields = req.query.fields;

    const rows = await Product.list(filter, limit, skip, sort, fields);
    res.json({ success: true, result: rows });
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
