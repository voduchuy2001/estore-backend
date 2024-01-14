const Order = require("../models/order");

const tracking = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
    }).populate("products");

    if (!order) {
      return res.status(200).json({
        message: "Not found records",
      });
    }

    return res.status(200).json({
      order: order,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  tracking: tracking,
};
