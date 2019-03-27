const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("landing");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const errors = [];
  const { username, email, phone, password, password2 } = req.body;
  if (!username || !password || !password2 || !email || !phone) {
    errors.push({ msg: "Fill all required fields" });
  }
  if (password !== password2) {
    errors.push({ msg: "Passsword do not match" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Password length must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", { username, email, phone, password, errors });
  } else {
    User.findOne({ username: username }, (err, user) => {
      if (err) throw err;
      if (user) {
        errors.push({ msg: "User exists." });
        res.render("register", { email, phone, password, errors });
      } else {
        var newUser = new User({
          username,
          email,
          phone,
          password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              console.log(err);
            } else {
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash('success', 'Successfully registered')
                  res.redirect("/login");
                })
                .catch(err => console.log(err));
            }
          });
        });
      }
    });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: true
  }),
  (req, res) => {}
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash('success', 'You are logged out')
  res.redirect("/login");
});

module.exports = router;
