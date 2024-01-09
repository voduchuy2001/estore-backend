const express = require("express");
const cors = require("cors");
const database = require("./config/database");
const initAPIRoutes = require("./routes/api");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
database();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const port = process.env.PORT || 6969;

initAPIRoutes(app);

app.use((req, res, next) => {
  return res.status(404).json({ msg: "404" });
});

app.listen(port, () => {
  console.log("[http://localhost:" + port + "]");
});
