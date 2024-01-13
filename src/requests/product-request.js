const { body } = require("express-validator");

const create = () => [
  body("name").notEmpty().withMessage("Name is required"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Must be a number"),
  body("category").notEmpty().withMessage("Category is required"),
];

module.exports = {
  create: create,
};
