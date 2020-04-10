var Campground = require("../models/campground"),
    Comment    = require("../models/comment"),
    Post       = require("../models/blog");

    var middleware = {};
    middleware.isLoggedin= function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        } 
        req.flash("error","You must be logged in to do that")
        res.redirect("/login");
    }

    middleware.checkCampOwenership =function(req, res, next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundcamp){
                if(err){
                    req.flash("error","Campground was not found in database.")
                    res.redirect("/campgrounds");
                } else{
                  if(foundcamp.author.id.equals(req.user._id)){
                      next();
                  } else{
                     req.flash("error","Nice try! Not Happening")
                     res.redirect("back");
                  }
                }
            })
        }else{
            req.flash("error","You need to be logged in to do that.");
            res.redirect("back");
        }
    }

    middleware.checkPostOwenership = function(req, res, next){
        if(req.isAuthenticated()){
            Post.findById(req.params.id, function(err, foundpost){
                if(err){
                    req.flash("error","Post was not found in database.");
                    res.redirect("/Blitzposts");
                } else{
                  if(foundpost.author.id.equals(req.user._id)){
                      next();
                  } else{
                    res.redirect("back");
                  }
                }
            })
        }else{
            req.flash("error", "You need to be logged in to do that.");
            res.redirect("back");
        }
    }

   middleware.checkCommentOwenership = function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundcomment){
                if(err){
                    req.flash("error","Comment was not found in database.");
                    res.redirect("back");
                } else{
                  if(foundcomment.author.id.equals(req.user._id)){
                      next();
                  } else{
                      res.redirect("back");
                  }
                }
            })
        }else{
            req.flash("error", "You need to be logged in to do that.");
            res.redirect("back");
        }
    }

    module.exports= middleware;