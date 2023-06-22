const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tmpFolderPath = "./tmp";
    if (!fs.existsSync(tmpFolderPath)) {
      fs.mkdirSync(tmpFolderPath);
    }
    cb(null, "./tmp");
  },
  filename: function (req, file, cb) {
    cb(null, "avatar" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload.single("avatar");
