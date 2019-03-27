//npm modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const methodOverride = require("method-override");

// modules created
const config = require("./middleware/passport");

//routes
var commentRoute = require("./routes/comment");
var authRoute = require("./routes/auth");
var campgroundRoute = require("./routes/campground");

// connection to database
mongoose
  .connect("mongodb://freecode19:freecode19@ds221435.mlab.com:21435/mysuuloladb", { useNewUrlParser: true })
  .then(() => console.log("connected to database"))
  .catch(err => console.log("Error connecting ${err}"));

// middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "you wanna know the secret abi",
    resave: true,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// passport configuration
config(passport);

// global inputs
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.currentUser = req.user;
  next();
});

// routes
app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/comments", commentRoute);
app.use("/", authRoute);

// port
app.listen( process.env.port || 5100 )
