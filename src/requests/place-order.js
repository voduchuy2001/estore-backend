const { body } = require("express-validator");

const placeOrder = () => [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email format wrong"),
  body("name").notEmpty().withMessage("Name is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("phoneNumber")
    .matches(/^(?:\+84|0)(?:3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-9])[0-9]{7}$/)
    .withMessage("Invalid Vietnamese phone number"),
  body("productIds")
    .isArray({ min: 1 })
    .withMessage("Products are required")
    .custom((value) => {
      for (let productId of value) {
        if (!Array.isArray(productId) || productId.length !== 2) {
          throw new Error("Invalid format");
        }
        const [id, quantity] = productId;
        if (
          typeof id !== "string" ||
          typeof quantity !== "number" ||
          quantity < 1
        ) {
          throw new Error("Invalid data");
        }
      }
      return true;
    }),
];

module.exports = {
  placeOrder: placeOrder,
};
