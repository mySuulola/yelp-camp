const express = require("express");
const router = express.Router({mergeParams: true});

const Comment = require("../models/Comment");
const Campground = require("../models/Campground");
const validator = require('../middleware/validator')



router.get("/new", validator.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    res.render("newcomment", { campground: campground });
  });
});

router.post("/", validator.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      var {text} = req.body;
      var author = {id: req.user._id, username: req.user.username}
      Comment.create(
        { text, author },
        (err, comment) => {
          if (err) {
            console.log(err);
          } else {
            // comment.author.id = req.user._id
            // comment.author.username = req.user.username
            // comment.save()
            campground.comments.push(comment);
            campground.save();
            req.flash('success_msg', 'Created a comment successfully')
            res.redirect("/campgrounds/" + campground._id);
          }
        }
      );
    }
  });
});

router.get("/edit/:comment_id", validator.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    res.render('editcomment', {comment: comment, campground_id: req.params.id })
  })
})

// ("/campgrounds/:id/comments" 

router.put('/:comment_id', validator.checkCommentOwnership, (req, res) => {
  const {text} = req.body
  const updatedData = {text}
  Comment.findByIdAndUpdate(req.params.comment_id, {$set: updatedData }, (err, updatedComment) => {
    if(err) {
      res.redirect('/campgrounds')
    }else{
      res.redirect(`/campgrounds/${req.params.id}`)
    }
  })
 })

router.delete('/:comment_id', validator.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if(err) {
      res.redirect("back")
    }else{
      req.flash('success_msg', 'Successfully deleted')
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})

module.exports = router;
