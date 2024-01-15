const { body } = require("express-validator");

const forgot = () => [
  body("email")
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Email format wrong!"),
];

const reset = () => [
  body("email")
  .notEmpty()
  .withMessage("Email is required!")
  .isEmail()
  .withMessage("Email format wrong!"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password min 6 characters"),
];

module.exports = {
  forgot: forgot,
  reset: reset,
};
