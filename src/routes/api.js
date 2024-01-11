const express = require("express");
const authController = require("../controllers/auth-controller");
const productController = require("../controllers/product-controller");

const router = express.Router();

const initAPIRoutes = (app, upload) => {
  router.post("/login", authController.login);
  router.post("/register", authController.register);
  router.post("/logout", authController.logout);

  router.post("/new-product", upload.single("image"), productController.create);

  app.use("/api/v1", router);
};

module.exports = initAPIRoutes;
