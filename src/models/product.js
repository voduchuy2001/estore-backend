const mongoose = require("mongoose");

var productSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    image: String,
    price: Number,
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
