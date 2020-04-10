var mongoose= require("mongoose");
//-------------Blitz Post Schema---------------------
var postSchema = new mongoose.Schema({
    title: String,
    image : String,
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
   ],
    created: {type: Date , default: Date.now }
    
  });
  module.exports = mongoose.model("Post",postSchema);