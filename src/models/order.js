const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderProduct",
        required: true,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
