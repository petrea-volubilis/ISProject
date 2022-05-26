const path = require("path");

const express = require("express");

const app = express();

const mongoose = require("mongoose");
const dbURI =
  "mongodb+srv://Yasser:Yasser29@cluster0.hirzu.mongodb.net/IS_Project?retryWrites=true&w=majority";

// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const methodOverride = require("method-override");

const multer = require("multer");

const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const passport = require("passport");

const db = require("./util/database");

const options = {
  host: "35.238.146.57",
  database: "wahah",
  user: "root",
  password: "Yasser29",
  port: "3306",
};

const sessionStore = new MySQLStore(options, db);

app.use(
  session({
    secret: "My Secret",
    saveUninitialized: false,
    resave: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(
  "/public/images",
  express.static(path.join(__dirname, "public/images"))
);

require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(methodOverride("_method"));

app.use((req, res, next) => {
  // console.log(req.user.role);
  let isAuthenticated = false;
  if (req.isAuthenticated()) {
    isAuthenticated = true;
  }
  console.log(isAuthenticated);
  res.locals.isAuthenticated = isAuthenticated;
  if (req.user) {
    res.locals.role = req.user.role;
    res.locals.email = req.user.email;
  }

  next();
});

const cartRoutes = require("./routes/cart");
const customerRoutes = require("./routes/customer");
const plantRoutes = require("./routes/plant");
const orderRoutes = require("./routes/order");

app.use(cartRoutes);

app.use(customerRoutes);

app.use(plantRoutes);

app.use(orderRoutes);

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
