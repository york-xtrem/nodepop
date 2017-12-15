"use strict";

const mongoose = require("mongoose");

/**
 * Product Schema
 *
 * TODO:
 * REGEX for mail, example:
 * var match = [ /\.html$/, "That file doesn't end in .html ({VALUE})" ];
 * var s = new Schema({ file: { type: String, match: match }})
 */

// The Number.MAX_SAFE_INTEGER constant represents the maximum safe integer in JavaScript 9007199254740991
let min = [0, "The value of `{PATH}` ({VALUE}) is negative."];
let max = [
  9007199254740991,
  "The value of `{PATH}` ({VALUE}) exceeds the limit ({MAX})."
];

let tags = {
  values: ["work", "lifestyle", "motor", "mobile"],
  message: " Enum validator failed for `{PATH}` with value `{VALUE}`"
};
const productSchema = mongoose.Schema({
  name: { type: String, trim: true, index: true, required: true },
  sale: { type: Boolean, index: true, required: true },
  price: {
    type: Number,
    min: min,
    max: max,
    index: true
  },
  photo: { type: String },
  tags: [{ type: String, enum: tags, index: true }]
});

/**
 * List products
 */
productSchema.statics.list = function(filters, limit, skip, sort, fields) {
  const query = Product.find(filters);
  query.limit(limit);
  query.skip(skip);
  query.sort(sort);
  query.select(fields);
  return query.exec();
};

/**
 * Get tags enum
 */

// Product.schema.path('tags.enum').options.type)

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
