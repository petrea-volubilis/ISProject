const { validationResult } = require("express-validator/check");
const crypto = require("crypto");

const db = require("../util/database");
const genPassword = require("../util/passwordUtil").genPassword;

exports.getLogin = (req, res, next) => {
  res.status(422).render("login", {
    errorMessage: null,
    oldInput: {
      email: "",
      password: "",
    },
  });
};

exports.getSignUp = (req, res, next) => {
  res.render("signup", {
    errorMessage: null,
    oldInput: {
      email: "",
      password: "",
    },
  });
};

exports.postSignUp = async(req, res, next) => {
    const saltHash =await genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const email = req.body.email;
  const password = req.body.password;
 const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    res.render("signup", {
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
    });
  } else {
    await db.execute(
      "INSERT INTO user(email , password , salt, role) VALUES(? , ? , ?, ?)",
      [email, hash, salt, "c"]
    )
      .then(() => {
        res.redirect("/login");
      })
      .catch(() => {
        console.log("failed to create an account");
      });
  }
};
exports.getAbout = (req, res, next) => {
  res.render("about");
};
exports.postLogin =async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log(email, password);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("login", {
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
    });
  } else {
   await db.execute("SELECT * FROM user WHERE email = ?", [email])
      .then((result) => {
        if (result[0].length == 0) {
          return res.status(422).render("login", {
            errorMessage: "Invalid email.",
            oldInput: {
              email: email,
              password: password,
            },
          });
        } else {
          let mail = require("../AuthInfo");
          mail.setEmail(email);
          next();
        }
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

exports.getContact = (req, res, next) => {};

