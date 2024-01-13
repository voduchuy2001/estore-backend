const Product = require("../models/product");

const create = async (req, res) => {
  const { productName, category, description, price } = req.body;
  const image = req.file;

  try {
    const product = await Product.create({
      name: productName,
      category: category,
      description: description,
      price: price,
      image: image ? image.filename : "",
    });

    return res.status(200).json({
      message: "Product created successfully",
      product: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const index = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 12;
    const search = req.query.search || "";

    const products = await Product.find({
      name: { $regex: search, $options: "i" },
    }).limit(limit);

    if (!products) {
      return res.status(200).json({
        message: "Not found records",
      });
    }

    return res.status(200).json({
      message: "Products",
      products: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  create: create,
  index: index,
};
