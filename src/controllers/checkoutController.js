const moment = require("moment");
const querystring = require("qs");
const Order = require("../models/order");

const redirect = async (req, res) => {
  try {
    const { email, name, total } = req.body;

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const order = await Order.create({
      name: name,
      email: email,
      total: total,
      status: "pending",
    });

    let tmnCode = "578OFK9C";
    let secretKey = "ZENTLNQFERZDRTZGUSONUPVHJTMFVFVL";
    let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    let returnUrl = "http://localhost:3000/callback-vnpay";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");
    let amount = total;
    let bankCode = "NCB";

    let orderInfo = "Demo";
    let orderType = "billpayment";
    let locale = "vn";

    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = order.id;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    return res.status(200).json({
      url: vnpUrl,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const callback = async (req, res) => {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    let secretKey = "ZENTLNQFERZDRTZGUSONUPVHJTMFVFVL";

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    if (secureHash !== signed) {
      return res.status(200).json({
        message: "Invalid signature",
      });
    }

    if (vnp_Params["vnp_ResponseCode" !== "00"]) {
      return res.status(200).json({
        message: "Transaction failed",
      });
    }

    const orderId = vnp_Params["vnp_TxnRef"];
    await Order.findOneAndUpdate(
      { _id: orderId },
      { status: "paid" },
      { new: true }
    );

    return res.status(200).json({
      message: "Transaction success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const sortObject = (obj) => {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
};

module.exports = {
  redirect: redirect,
  callback: callback,
};
