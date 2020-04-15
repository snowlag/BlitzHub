
var express=require("express"),
    router= express.Router(),
    Campground= require("../models/campground"),
    Comment   = require("../models/comment"),
    methodOverride= require("method-override"),
    middleware= require("../middleware");




router.use(methodOverride("_method"));
router.get("/campgrounds",function(req,res){
Campground.find({},function(error,campgrounds){  //Find all the campground from database and add it to campground page.
     if(error){
        req.flash("error","Something went wrong")
        res.redirect("back");
     } else{
       req.flash("error","BlitzCamps are currently taken down because of COVID-19. Checkout the BlitzPosts. Stay Home stay Safe")
       res.render("Blitzcamps/campgrounds",{campgrounds : campgrounds});
         
     }
    });
});

//----------------Post request-----------------------------------------------
router.post("/campgrounds",middleware.isLoggedin, function(req,res){
    var name = req.body.name;
    var image= req.body.url;
    var description= req.sanitize(req.body.description);
    var cost = req.body.cost;
    var location=req.body.location;
    var author ={
        id: req.user._id,
        username: req.user.username
    }
    var newCamp={name : name, image: image , description: description, author: author, cost: cost , location: location};
//--------------------------Save the new Campground in database----------------------
    Campground.create(newCamp,function(error,campground){   
        if(error){
            req.flash("error","Something went wrong")
            res.redirect("back");
        } else{

            console.log("Saved to Database");
            console.log(campground);
            req.flash("success","Thanks for adding Campground");
            res.redirect("/campgrounds");
        }
    });
    
});
//---------------------Route to add new campground------------------------------
router.get("/campgrounds/new" ,middleware.isLoggedin, function(req,res){
       res.render("Blitzcamps/new");
});
//----------------Route to view campground by particulat id-----------------------
router.get("/campgrounds/:id" , function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err , foundCamp){
       if(err){
        req.flash("error","Something went wrong")
        res.redirect("back");
       }else{
           
           res.render("Blitzcamps/viewCamp", {campground : foundCamp});
            }
    });
});
//Adding Comment Route
router.post("/campgrounds/:id" ,middleware.isLoggedin, function(req,res){
 Campground.findById(req.params.id).populate("comments").exec(function(err , foundCamp){
       if(err){
        req.flash("error","Something went wrong")
        res.redirect("back");
       }else{
        Comment.create(req.body.comment, function(error, comment){
                if(err){
                    req.flash("error","Something went wrong")
                    res.redirect("back");
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCamp.comments.push(comment);
                    foundCamp.save()
                    req.flash("success","review added successfully!")
                    res.redirect("/campgrounds/"+ req.params.id);
                }
            });
          
            }
    });
});

//Edit campground Route
router.get("/campgrounds/:id/edit",middleware.checkCampOwenership, function(req,res){
   Campground.findById(req.params.id, function(err , foundcamp){
       if(err){
           req.flash("error","Something went wrong")
           res.redirect("back");
       }else{
           res.render("Blitzcamps/editcamp", {campground : foundcamp});
       }
   }) 
})
//Handel Put request to update the campground
router.put("/campgrounds/:id",middleware.checkCampOwenership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id ,req.body.camp , function(err,updatedCamp){
       if(err){
           req.flash("error","Something went wrong")
           res.redirect("/campgrounds/" + req.params.id + "/edit"); 
       } else{
           req.flash("success", "Updated the Campground successfully.")
           res.redirect("/campgrounds/" +req.params.id);
       }
    })
})

//Handel delete campground request
router.delete("/campgrounds/:id",middleware.checkCampOwenership, function(req,res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
        req.flash("error","Something went wrong")
        res.redirect("back");
            res.redirect("/campgrounds/" +req.params.id);
           
        } else{
            req.flash("success", "Deleted the Campground successfully.")
            res.redirect("/campgrounds");
        }
    })
})
//delete comment request
router.delete("/campgrounds/:id/:comment_id" ,middleware.checkCommentOwenership, function(req, res){
        Comment.findByIdAndDelete(req.params.comment_id, function(err){
            if(err){
                req.flash("error","Something went wrong")
                res.redirect("back");
            } else{
                req.flash("success", "Deleted the comment successfully.")
                res.redirect("/campgrounds/" + req.params.id);
            }
        })
    
})

  

module.exports= router;