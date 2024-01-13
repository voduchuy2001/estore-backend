const multer = require("multer");
const path = require("path");

const configureMulter = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../images"));
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
    },
  });

  return multer({ storage: storage });
};

module.exports = configureMulter;
