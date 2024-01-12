const moment = require("moment");
const querystring = require("qs");
const Order = require("../models/order");

const redirect = async (req, res) => {
  try {
    const { email, name, total } = req.body;

    if (!email || !name || !total) {
      return res.status(200).json({
        message: "Missing input field",
      });
    }

    await Order.create({
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
    let orderId = moment(date).format("DDHHmmss");
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
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = "127.0.0.2";
    vnp_Params["vnp_CreateDate"] = createDate;

    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
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

const callback = async () => {
  try {
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

function sortObject(obj) {
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
}

module.exports = {
  redirect: redirect,
  callback: callback,
};
