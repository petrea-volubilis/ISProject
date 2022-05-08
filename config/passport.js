const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const validatePassword = require("../util/passwordUtil").validatePassword;
const db = require("../util/database.js");

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const verifyCallback = (username, password, done) => {
  console.log("verify");
  db.execute("SELECT * FROM user WHERE email = ?", [username])
    .then((result) => {
      if (result[0].length == 0) {
        return done(null, false);
      }

      const isValid = validatePassword(
        password,
        result[0][0].password,
        result[0][0].salt
      );

      if (isValid) {
        console.log("found");
        return done(null, result[0][0]);
      } else {
        console.log("dont match");
        return done(null, false, { message: "Incorrect password." });
      }
    })
    .catch((err) => {
      done(err);
    });
};

const strategy = new LocalStrategy(customFields, verifyCallback, {
  passReqToCallback: true,
});

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser((userId, done) => {
  db.execute("SELECT * FROM user WHERE user_id = ?", [userId])
    .then((result) => {
      done(null, result[0][0]);
    })
    .catch((err) => done(err));
});
