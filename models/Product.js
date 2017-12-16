"use strict";

const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");

/**
 * Product Schema
 */

let min = [0, "The value of `{PATH}` ({VALUE}) is negative."];
let max = [
  Number.MAX_SAFE_INTEGER,
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
 * Plugin with promise
 * promises = {
 *   docs: docsQuery.exec(),
 *   count: this.count(query).exec()
 * };
 */
productSchema.plugin(mongoosePaginate);

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
 * Get tags enum from Model
 */
productSchema.statics.tags = function() {
  return productSchema.obj.tags[0].enum.values;
};
// Product.schema.path('tags.enum').options.type)

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
