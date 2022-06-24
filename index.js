const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/static", express.static("public"));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer().array());

app.listen(3000, () => console.log("Server is listen 3000"));

app.use(
  cors({
    origin: true,
  })
);

const storage = multer.diskStorage({
  destination: "public",
  filename: (req, file, cb) => {
    let filename = req.headers.filename
      ? req.headers.filename + path.extname(file.originalname)
      : file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});
// Init upload
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("img");

// Check file input
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const middleware = (req, res, next) => {
  console.log(req.body);
  next();
};

app.post("/posts", middleware, upload, (req, res) => {
  return res.send(`http://45.77.119.159/static/${req.file.filename}`);
});

app.get("/", (req, res) => {
  res.render("index");
});
