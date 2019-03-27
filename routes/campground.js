const express = require("express");
const router = express.Router();

const Campground = require("../models/Campground");
const validator = require('../middleware/validator')


router.get("/", (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) throw err;
    res.render("index", {
      campgrounds: campgrounds,
    });
  });
});

router.post("/", validator.isLoggedIn, (req, res) => {
  var author = {id: req.user._id, username: req.user.username}
  var newCampground = {
    name: req.body.name,
    date: req.body.date,
    image: req.body.image,
    description: req.body.description,
    price: req.body.price,
    author: author
  };
  Campground.create(newCampground, (err, newCampground) => {
    if (err) throw err;
    res.redirect("/campgrounds");
  });
});

router.get("/new", validator.isLoggedIn, (req, res) => {
  res.render("new");
});

router.get("/:id/", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, campground) => {
      if (err) {
        console.log(err);
      } else {
        res.render("show", { campground: campground, currentUser: req.user });
      }
    });
});

router.get('/:id/edit',validator.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    res.render('editcamp', {campground})
  })
})

router.put('/:id',validator.checkCampgroundOwnership, (req, res) => {
  const {name, image, price, description} = req.body
  const updatedData = {name, image, price, description}
  Campground.findByIdAndUpdate(req.params.id, {$set: updatedData}, (err, updatedCampground) => {
    if(err) {
      res.redirect('/campgrounds')
    }else{
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})


router.delete('/:id',validator.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if(err) {
      res.redirect('/campgrounds')
    }else{
      res.redirect('/campgrounds')
    }
  })
})

module.exports = router;
