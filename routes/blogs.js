var express=require("express"),
    router= express.Router(),
    Post  = require("../models/blog");
    Comment   = require("../models/comment"),
    methodOverride= require("method-override"),
    middleware= require("../middleware/index");







router.use(methodOverride("_method"));
router.get("/BlitzPosts",function(req,res){
    Post.find({},function(error,posts){   //Find all the posts from database and add it to view page.
          if(error){
            req.flash("error","Something went wrong")
            res.redirect("back");
          } else{
             res.render("BlitzPost/Blitzpost",{posts : posts});
          }
         });
     });
 //---------------------------Post request to save post data in database-----------------------------
 router.post("/BlitzPosts",middleware.isLoggedin, function(req,res){
      var title= req.body.title,
          image = req.body.image,
          description= req.sanitize(req.body.description),
          author={
              id: req.user._id,
              username: req.user.username
          }
    var newpost={title: title ,image: image , description: description , author: author}
    Post.create(newpost,function(error,post){
         if(error){
            req.flash("error","Something went wrong")
            res.redirect("back");
         } else{
             console.log(post);
             req.flash("success","Thanks for submitting the blog! Your blog is added to our showcase")
             res.redirect("/BlitzPosts");
         }
     });
     
 });
 //-----------------------form route to add new post---------------
 router.get("/BlitzPosts/newpost" ,middleware.isLoggedin, function(req,res){
     res.render("BlitzPost/newpost");
 });
 //-------------------------View Post---------------
 router.get("/BlitzPosts/:id",function(req,res){
     Post.findById(req.params.id).populate("comments").exec( function(err,foundpost){
        if(err){
            req.flash("error","Something went wrong")
            res.redirect("back");
        }else{
            res.render("BlitzPost/viewpost",{post : foundpost} );
        }
     });
 });
 //---------------------------Adding Comment Post request-----------------------------------
 router.post("/BlitzPosts/:id" ,middleware.isLoggedin, function(req,res){
    Post.findById(req.params.id).populate("comments").exec(function(err , foundpost){
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
                       foundpost.comments.push(comment);
                       foundpost.save()
                       req.flash("success", "Comment was added successfully")
                       res.redirect("/BlitzPosts/"+ req.params.id);
                   }
               });
             
               }
       });
   });

//------------Edit Post request--------------------------------------------------------------
 router.get("/BlitzPosts/:id/edit",middleware.checkPostOwenership , function(req,res){
     Post.findById(req.params.id,function(err,foundPost){
        if(err){
            req.flash("error","Something went wrong")
            res.redirect("back");
        } else{
         
         res.render("BlitzPost/editPost",{post : foundPost});
        }
     });
 });
 
 router.put("/BlitzPosts/:id", middleware.checkPostOwenership ,function(req, res){
     req.body.post.description= req.sanitize(req.body.post.description);
     Post.findByIdAndUpdate(req.params.id,req.body.post,function(err,updatePost){
       if(err){
        req.flash("error","Something went wrong")
        res.redirect("back");
       }else{
           req.flash("success", "Post updated successfully")
           res.redirect("/BlitzPosts/" + req.params.id);
         }
 
     });
 });
 
//-------------------------Delete Post Request-------------------------------------------
 router.delete("/BlitzPosts/:id",middleware.checkPostOwenership, function(req,res){
   Post.findByIdAndDelete(req.params.id, function(error){
     if(error){
        req.flash("error","Something went wrong")
        res.redirect("back");
     } else{
         req.flash("success", "Post deleted successfully")
         res.redirect("/BlitzPosts");
     }
   });
 });
//---------------------------delete Comment request---------------------------------------------------------
 router.delete("/BlitzPosts/:id/:comment_id" ,middleware.checkCommentOwenership, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
            req.flash("error","Something went wrong")
            res.redirect("back");
        } else{
            req.flash("success", "Comment deleted successfully")
            res.redirect("/BlitzPosts/" + req.params.id);
        }
    })

})

 module.exports= router;