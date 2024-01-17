const express = require("express");
const cors = require("cors");
const database = require("./config/database");
const morgan = require("morgan");
const { rateLimit } = require("express-rate-limit");
const initAPIRoutes = require("./routes/api");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
database();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.URL_SERVER,
    credentials: true,
  })
);
app.use(
  "/images",
  express.static(path.join(__dirname, "../src/storage/images"))
);
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "/storage/logs/express.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
});

app.use(limiter);

const port = process.env.PORT || 6969;

initAPIRoutes(app);

app.use((req, res, next) => {
  return res.status(404).json({ message: "404" });
});

app.listen(port, () => {
  console.log("[http://localhost:" + port + "]");
});
