const Product = require("../models/product");

const create = async (req, res) => {
  console.log(req.body, req.file);
  const { productName, category, description, price } = req.body;
  const image = req.file.filename;

  try {
    if (!productName || !category || !description || !price || !image) {
      return res.status(400).json({
        message: "Missing input field",
      });
    }

    const product = await Product.create({
      name: productName,
      category: category,
      description: description,
      price: price,
      image: image,
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

module.exports = {
  create: create,
};
