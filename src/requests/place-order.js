const { body } = require("express-validator");

const placeOrder = () => [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email format wrong"),
  body("name").notEmpty().withMessage("Name is required"),
];

module.exports = {
  placeOrder: placeOrder,
};
