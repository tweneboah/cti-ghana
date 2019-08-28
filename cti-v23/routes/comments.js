const express = require('express');
const router = express.Router({mergeParams: true});
const Post = require('../models/post')
const Comment = require('../models/comment');
const middleware = require('../middleware/index')


//1. get the comment form

router.get('/new', middleware.isLogin , (req, res) => {
 //find camprgound by ID after finding the id we will search for the full details of the campground and we will pass it to the form template
 

 Post.findById(req.params.id, (err, post) => {
     if(err){
         console.log(err)
     }else {
       
          res.render('comments/new', {post: post})
     }
 })
})

//Create Comment

router.post("/" , function(req, res){
//lookup campground using ID
Post.findById(req.params.id, function(err, post){
    if(err){
        console.log(err);
        res.redirect("/posts");
    } else {
        //req.body.comment contains all the values from the form
     Comment.create(req.body.comment, function(err, comment){
        if(err){
            console.log(err);
        } else {
            //Add username and id to comment. This can be found as req.user

            //associating the req.user.username and req.user._id to the author field inside the comment models. This means we are pushing the login user to the author inside the comment model. The comment here is an instance of the comment model created

            //Pushing the login user details to comments array/model
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
             
            //Save the comment
            comment.save();
    
            //Adding to campgrounds comment
            post.comments.push(comment);
            //save
            post.save();
            res.redirect('/posts/' + post._id);
        }
     });
    }
});

}); 


// //==========
// //====EDIT AND UPDATE COMMENT ROUTE
// //=====================

// //1. get the edit form
// //Then fetch comments and campgrounds and pass it to edit form template

// router.get('/:comment_id/edit', (req, res) => {
//     //Here we want only the id of the campground and from our main route in the app.js it can be found as req.params.id

//     //Next we need the id of the comment which is also can be found as req.params.comment_id
//     Comment.findById(req.params.comment_id, (err, foundComment) => {
//         if(err){
//             console.log(er)
//         }else{
//             res.render('comments/edit', {campground_id: req.params.id, comment: foundComment})

            
//         }
//     })
   
// })
// //EDIT LOGIC
// router.put('/:comment_id', (req, res) => {
//     //  //Getting the values from the edit form
//      let editedComment = req.body.comment
//       Comment.findByIdAndUpdate(req.params.comment_id, editedComment, (err, updatedComment)=> {
//           if(err){
//               console.log(err)
//           }else {
//             //   res.redirect('/campgrounds'/ + req.params.id)

//             res.redirect(`/posts/${req.params.id}`)
//           }
//       })

    
// })


// //==========
// // DELETE COMMENT
// //=============
// router.delete('/:comment_id', (req, res) => {
//     Comment.findByIdAndRemove(req.params.comment_id, (err, commentDeleted) => {
//         if(err){
//             console.log(er)
//         }else {
//             res.redirect(`/posts/${req.params.id}`)
//         }
//     })
// })

module.exports = router