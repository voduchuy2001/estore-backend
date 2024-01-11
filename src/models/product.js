const mongoose = require("mongoose");

var productSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    image: String,
    price: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
