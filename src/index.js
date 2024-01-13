const express = require("express");
const cors = require("cors");
const database = require("./config/database");
const initAPIRoutes = require("./routes/api");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const configureMulter = require("./config/multer");
require("dotenv").config();

const app = express();
database();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/images", express.static(path.join(__dirname, "../src/images")));
app.enable("trust proxy");

const port = process.env.PORT || 6969;

initAPIRoutes(app, configureMulter());

app.use((req, res, next) => {
  return res.status(404).json({ message: "404" });
});

app.listen(port, () => {
  console.log("[http://localhost:" + port + "]");
});
