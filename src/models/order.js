const mongoose = require("mongoose");

var orderSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    total: String,
    status: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
