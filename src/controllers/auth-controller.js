const User = require("../models/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../config/mail");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        message: "Not found record",
      });
    }

    const compare = await user.comparePassword(password);

    if (!compare) {
      return res.status(400).json({
        message: "Password dose not match",
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

    await User.create({
      email: email,
      password: password,
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

const forgot = async (req, res) => {
  try {
    const { email } = req.body;

    const resetPasswordToken = crypto.randomBytes(32).toString("hex");

    const user = await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          passwordResetToken: crypto
            .createHash("sha256")
            .update(resetPasswordToken)
            .digest("hex"),
          passwordResetExpired: Date.now() + 15 * 60 * 1000,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        message: "Not found record",
      });
    }

    const html = `You are receiving this email because we received a password reset request for your account.This password reset link will expire in 15 minutes. 
            <a href=${process.env.URL_SERVER}/reset-password/${resetPasswordToken}>Click here</a>`;

    const mail = await transporter.sendMail({
      from: process.env.MAIL_FROM_ADDRESS,
      to: user.email,
      subject: "Reset Password",
      html: html,
    });

    if (!mail) {
      return res.status(200).json({
        message: "Please try again",
      });
    }

    return res.status(200).json({
      message: "A password retrieval link has been sent to your email address",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const reset = async (req, res) => {
  try {
    const { password, token } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpired: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token expired",
      });
    }

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpired = null;
    user.passwordChangedAt = Date.now();

    await user.save();

    return res.status(200).json({
      message: "Your password has been reset",
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
  forgot: forgot,
  reset: reset,
};
