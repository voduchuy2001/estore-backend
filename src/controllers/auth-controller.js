const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Missing input field",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        message: "Not found records",
      });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(401).json({
        message: "Unauthorize",
      });
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN, {
      expiresIn: "10000d",
    });

    return res.status(200).json({
      message: "Login success",
      accessToken: accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Missing input field",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password dose not match",
      });
    }

    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(400).json({
        message: "Email has been already exits",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      email: email,
      password: hashPassword,
    });

    return res.status(200).json({
      message: "Register success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  login: login,
  register: register,
};
