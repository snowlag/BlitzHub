var mongoose= require("mongoose");
//----------Campground Schema-----------------------
var CampgroundSchema = new mongoose.Schema({
	name : String,
   image: String,
   cost: Number,
   location: String,
   lat: Number,
   lng: Number,
   description: String,
    author:{
       id: {
          type: mongoose.Schema.ObjectId,
          ref:"User"
       },
       username: String
    } ,

       
    comments:[
        {
           type: mongoose.Schema.ObjectId,
           ref: "Comment"
        }
     ]
});
module.exports=mongoose.model("Campground", CampgroundSchema);