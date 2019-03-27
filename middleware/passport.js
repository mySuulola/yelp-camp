const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("../models/User");

function config(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }).then(user => {
        if (!user) {
          console.log("user not found");
          return done(null, false, { message: "User is not registered" });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user, {
              message: "You are successfully logged in"
            });
          } else {
            return done(null, false, { message: "Incorrect password" });
          }
        });
      });
    })
  );
}

module.exports = config;
