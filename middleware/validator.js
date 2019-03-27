const Comment = require('../models/Comment')
const Campground = require('../models/Campground')

var validator = {
   isLoggedIn: function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
          next();
        } else {
          req.flash("error_msg", "Please log in first");
          res.redirect("back");
        }
      },
    checkCommentOwnership: function checkCommentOwnership(req, res, next) {
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, (err, comment) => {
                if(comment.author.id.equals(req.user._id)){
                    next()
                }else{
                    req.flash('error_msg', 'You are not the owner of this page')
                    res.redirect('back')
                }
            })
        }else{
            req.flash('error_msg', 'Please log in first')
            res.redirect("back")
        }
    },

    checkCampgroundOwnership: function checkCampgroundOwnership(req, res, next) {
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, (err, campground) => {
                if(campground.author.id.equals(req.user._id)){
                    next()
                }else{
                    req.flash('error_msg', 'You are not the owner of this page')
                    res.redirect('back')
                }
            })
        }else{
            req.flash('error_msg', 'You need to be logged in')
            res.redirect("back")
        }
    },
}


module.exports = validator