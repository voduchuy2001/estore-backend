const express = require("express");
const authController = require("../controllers/auth-controller");
const productController = require("../controllers/product-controller");
const checkoutController = require("../controllers/checkout-controller");
const socialiteController = require("../controllers/socialite-controller");
const orderController = require("../controllers/order-controller");
const authRequest = require("../requests/auth-request");
const placeOrderRequest = require("../requests/place-order");
const validate = require("../middlewares/validate");
const validateUser = require("../middlewares/authenticated");

const router = express.Router();

const initAPIRoutes = (app, upload) => {
  router.post("/login", authRequest.login(), validate, authController.login);
  router.post(
    "/register",
    authRequest.register(),
    validate,
    authController.register
  );
  router.post("/logout", authRequest.logout(), validate, authController.logout);

  router.post(
    "/new-product",
    [validateUser.verifyToken, validateUser.isAdmin],
    upload.single("image"),
    productController.create
  );
  router.get("/products", productController.index);

  router.post(
    "/redirect-vnpay",
    placeOrderRequest.placeOrder(),
    validate,
    checkoutController.redirect
  );
  router.get("/callback-vnpay", checkoutController.callback);

  router.get("/redirect/auth-google", socialiteController.redirect);
  router.get("/callback/auth-google", socialiteController.callback);

  router.get("/tracking/:id", orderController.tracking);

  app.use("/api/v1", router);
};

module.exports = initAPIRoutes;
