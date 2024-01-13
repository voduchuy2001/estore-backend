const { body, cookie } = require("express-validator");

const register = () => [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email format wrong"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password min 6 characters"),
];

const login = () => [
  body("email")
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Email format wrong!"),
  body("password").notEmpty().withMessage("Password is required"),
];

const logout = () => [
  cookie("accessToken").notEmpty().withMessage("Cookie is empty"),
];

module.exports = {
  login: login,
  register: register,
  logout: logout,
};
