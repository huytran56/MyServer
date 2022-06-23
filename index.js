const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const cors = require("cors");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/static", express.static("public"));

app.listen(3000, () => console.log("Server is listen 3000"));

app.use(
  cors({
    origin: true,
  })
);

const storage = multer.diskStorage({
  destination: "public",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
// Init upload
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log("111");
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

app.post("/posts", upload, (req, res) => {
  console.log(req.file);
  return res.send(`localhost:3000/static/${req.file.filename}`);
});

app.get("/", (req, res) => {
  res.render("index");
});
