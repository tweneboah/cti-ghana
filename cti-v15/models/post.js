const mongoose = require("mongoose");

let postSchema = new mongoose.Schema({
   image: String,
   videoLink: String,
   description: String,
   documentTitle: String,
   postTitle: String,
   createdAt: {
      type: Date,
      default: Date.now()
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
      },
      username: String, 
   }
});

module.exports = mongoose.model("Post", postSchema);