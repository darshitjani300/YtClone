import multer from "multer";

const storage = multer.diskStorage({
  //cb is callback
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    console.log("multer middleware file ", file);
  },
});

export const upload = multer({ storage });
