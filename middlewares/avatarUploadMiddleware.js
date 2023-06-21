const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tmp");
  },
  filename: function (req, file, cb) {
    cb(null, "avatar" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload.single("avatar");
