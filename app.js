//npm modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const bcrypt = require("bcryptjs");

// modules created
const Campground = require("./models/Campground");
const Comment = require("./models/Comment");
const seedDB = require("./seed");
const User = require("./models/User");

mongoose
  .connect("mongodb://localhost/yelp-camp", { useNewUrlParser: true })
  .then(() => console.log("connected to database"))
  .catch(err => console.log("Error connecting ${err}"));

seedDB();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(
  session({
    secret: "you wanna know the secret abi",
    resave: true,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

////////////////////////////////////////

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
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);

///////////////////
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.currentUser = req.user;
  next();
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("error_msg", "You have to be logged in to access that resource");
    res.redirect("/login");
  }
}

///////////////////

////////////////////////////////////////////////

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const errors = [];
  const { username, email, phone, password, password2 } = req.body;
  console.log(email, password, phone, password2, username);
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
    console.log(errors);
    res.render("register", { username, email, phone, password, errors });
  } else {
    User.findOne({ username: username }, (err, user) => {
      if (err) throw err;
      if (user) {
        errors.push({ msg: "User exists." });
        res.render("login", { username, errors });
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

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {}
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

/////////////////////////////////////

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", isLoggedIn, (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) throw err;
    res.render("index", {
      campgrounds: campgrounds,
      success_msg: "Welcome to your dashboard"
    });
  });
});
app.get("/campgrounds/new", isLoggedIn, (req, res) => {
  res.render("new");
});

app.post("/campgrounds", isLoggedIn, (req, res) => {
  var newCampground = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description
  };
  console.log(newCampground);
  Campground.create(newCampground, (err, newCampground) => {
    if (err) throw err;
    res.redirect("/campgrounds");
  });
});

app.get("/campgrounds/:id/", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, campground) => {
      if (err) {
        console.log(err);
      } else {
        console.log(campground);
        res.render("show", { campground: campground });
      }
    });
});

////////////////////////// coments
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    res.render("newcomment", { campground: campground });
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      var { text, author } = req.body;
      Comment.create(
        {
          text,
          author
        },
        (err, comment) => {
          if (err) {
            console.log(err);
          } else {
            campground.comments.push(comment);
            campground.save();
            res.redirect("/campgrounds/" + campground._id);
          }
        }
      );
    }
  });
});

const PORT = 5100;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
