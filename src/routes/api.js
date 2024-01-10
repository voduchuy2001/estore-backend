const express = require("express");
const authController = require("../controllers/auth-controller");

const router = express.Router();

const initAPIRoutes = (app) => {
  router.post("/login", authController.login);
  router.post("/register", authController.register);
  router.post("/logout", authController.logout);

  return app.use("/api/v1", router);
};

module.exports = initAPIRoutes;
