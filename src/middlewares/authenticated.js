const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const id = req.user.id;

    const user = await User.findOne({ _id: id });

    if (!user.isAdmin) {
      return res.status(401).json({
        message: "Access denied",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

module.exports = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
};
