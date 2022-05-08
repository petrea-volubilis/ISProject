const express = require("express");
const { check, body } = require("express-validator/check");
const passport = require("passport");

const router = express.Router();

const db = require("../util/database");

const customerController = require("../controllers/customer");
const plantController = require("../controllers/plant");

router.get("/login", customerController.getLogin);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    body("password", "Password has to be valid.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  customerController.postLogin,
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  })
);

router.get("/signup", customerController.getSignUp);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return db
          .execute(`SELECT * FROM user WHERE email = ?`, [value])
          .then((result) => {
            console.log("tt");
            if (result[0].length > 0)
              return Promise.reject(
                "E-Mail exists already, please pick a different one."
              );
          });
      })
      .normalizeEmail(),
    body("password", "Please enter a password with at least 5 characters.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
  ],
  customerController.postSignUp
);

router.get("/login-success", plantController.success);

router.get("/login-failure", (req, res, next) => {
  let email = require("../AuthInfo").getEmail();
  res.render("login", {
    errorMessage: "Invalid Password",
    oldInput: {
      email: email,
      password: "",
    },
  });
});

router.post("/logout", customerController.postLogout);

router.get("/contact", customerController.getContact);

router.get("/about", customerController.getAbout);

module.exports = router;
