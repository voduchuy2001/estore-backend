const Order = require("../models/order");
const User = require("../models/user");

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

const userOrders = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 12;
    const user = await User.findOne({ _id: req.user.id });

    const orders = await Order.find({ email: user.email })
      .populate({
        path: "products",
      })
      .limit(limit);

    return res.status(200).json({
      orders: orders ?? [],
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  tracking: tracking,
  userOrders: userOrders,
};
