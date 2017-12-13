"use strict";

const express = require("express");
const router = express.Router();
const responseCustom = require("../../utils/responseCustom");

// Load Products Schema
const Product = require("../../models/Product");

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
// TODO
router.put("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    const data = req.body;
    const agenteActualizado = await Agente.findOneAndUpdate(
      { _id: _id },
      data,
      { new: true }
    ).exec();
    res.json({ success: true, result: agenteActualizado });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
