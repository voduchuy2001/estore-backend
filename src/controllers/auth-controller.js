const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email: email });

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

    const userAccount = { ...user.toObject() };
    delete userAccount.password;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 100000,
    });

    return res.status(200).json({
      message: "Login success",
      user: userAccount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
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

const logout = (req, res) => {
  const cookie = req.cookies.accessToken;

  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({
      message: "Logout success",
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
  logout: logout,
};
