const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const redirect = async (req, res) => {
  try {
    const url = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: "email",
    });

    console.log(url);

    return res.status(200).json({
      url: url,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const callback = async (req, res) => {
  try {
    const code = req.query.code;
    const tokenResponse = await oAuth2Client.getToken(code);
    const idToken = tokenResponse.tokens.id_token;

    const ticket = await oAuth2Client.verifyIdToken({
      idToken: idToken,
    });

    const user = ticket.getPayload();

    const { email } = user;

    let account = await User.findOne({ email: email });

    if (!account) {
      account = new User({
        email: email,
      });
      await account.save();
    }

    const accessToken = jwt.sign({ id: account.id }, process.env.ACCESS_TOKEN, {
      expiresIn: "10000d",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 100000,
    });

    return res.status(200).json({
      message: "Login success",
      user: account,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  redirect: redirect,
  callback: callback,
};
