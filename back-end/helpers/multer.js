const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "IMG" +
        "-" +
        Date.now() +
        Math.round(Math.random() * 1000000) +
        "." +
        file.mimetype.split("/")[1]
    );
    console.log(file)
  },
});

exports.multerUpload = multer({ storage });
