const express = require('express');
const router = express.Router();
const Post = require('../models/post')

//middleware
function isLoggedIn(req, res, next){
 if(req.isAuthenticated()){
     return next();
 }
 req.flash('error', "Pleas login")
 res.redirect("/login");
}


//GET FORM
router.get("/new", isLoggedIn, function(req, res){
 
 res.render("posts/new.ejs"); 
});


//==================================
//INDEX PAGE -> Show all campgrounds
//==================================

router.get('/', (req, res) => {
 //Get All campgrounds from DB
 
 Post.find({}, (err, allPosts)=> {
     if(err){
         console.log(err)
     }else {
         
         res.render('posts/index', {posts: allPosts, currentUser: req.user})
     }
 })
})


//============================
// CREATE CAMPGROUNDS
//============================

router.post("/",isLoggedIn ,function(req, res){
 // get data from form and add to campgrounds array
 var name = req.body.name;
 var image = req.body.image;
 let desc = req.body.description

 //This must be the same as field in the model
 let author = {
     id: req.user.id,
     username: req.user.username
 }
 var newPost = {name: name, image: image, description: desc, author: author}

 //Create a new campground and save to DB
 Post.create(newPost, (err, newlyCreatedPost) => {
     if(err){
         //console.log(err)
     }else {
        
         res.redirect('/posts')
     }
 })
 
});

//=================
// SHOW MORE INFO
//=============

router.get('/:id', (req, res) => {
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
     if(err){
         console.log(err);
     } else {
         //render show template with that campground
         res.render("posts/show", {campground: foundPost});
     }
 });
});


//==========================
//EDIT CAMPGROUND AND UPDATE
//=========================

//get the edit form
router.get('/:id/edit', checkCampgroundOwnership, function(req, res) {

    Post.findById(req.params.id, (err, foundPost) => {
            res.render('posts/edit', {post: foundPost}) 

        })            
 })

//Editing logic
router.put('/:id', checkCampgroundOwnership, (req, res) => {
    //find the campground you want to update and then retrieve the data from the form you want to update. Because of that we will build the data coming from the edit form and pass it as a second arguemnt to findByIdAndUpdate
    let postsToBeUpdated = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    }
    Post.findByIdAndUpdate(req.params.id, postsToBeUpdated, (err, updatedPost) => {
        if(err){
            console.log(err)
        }else {
           
            res.redirect('/posts/' + req.params.id)
        }
    })
})


//==============
// DELETE
//=========

router.delete("/:id", function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/posts");
       } else {
           res.redirect("/posts");
       }
    });
 });


 //
 function checkCampgroundOwnership (req, res, next){
         //Is user logged in ?
    if(req.isAuthenticated()){
        
        Post.findById(req.params.id, (err, foundPost) => {
            if(err){
                res.redirect('back')
            }else {
                //If a user logged in, does the user own this post?
                //Here we will compare the id of the current logged in user to the user/author used to create this post

                //So after we found the campground we will compare the author's id  (foundCampground.author.id)and the current logged in user (req.user.id).

                //NOTE: The id from mongoose foundCampground.author.id is an object and the id from the authentication req.user.id is a string, so we can't use === to compare instead mongoose has an api that helps us to compare id in mongoose (object) to a string

            //    console.log('Author created this camp', typeof foundCampground.author.id);
            //    console.log('User who just login',typeof req.user.id)
                 if(foundPost.author.id.equals(req.user.id)){
                        next()
                 }else {
                     res.redirect('back') //Return user to previous page
                 }
                
            }
        })
    }else {
         res.redirect('back')
    }
 }

module.exports = router;

