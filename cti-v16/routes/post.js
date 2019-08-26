    const express = require('express');
    const router = express.Router();
    const Post = require('../models/post');
    const middleware = require('../middleware/index');
    const url = require('url')

    //=============
    //CLOUDINARY
    //=============

    const multer = require('multer');
    const storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
    });
    const imageFilter = function (req, file, cb) {
        // accept image files only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|mp4)$/i)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    };

    const upload = multer({ storage: storage, fileFilter: imageFilter})
    const cloudinary = require('cloudinary');
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    //==============
    //GET FORM
    //=============
    router.get("/new", middleware.isLogin,function(req, res){
    
        res.render('posts/new')
    });


    //==================================
    //INDEX PAGE -> Show all campgrounds
    //==================================

    router.get('/', middleware.isLogin, (req, res) => {
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


    router.post("/", middleware.isLogin, upload.single('image'), function(req, res) {
        cloudinary.v2.uploader.upload(req.file.path,  function(err, result) {
        if(err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        // add cloudinary url for the image to the post object under image property
        req.body.post.image = result.secure_url;
        // add image's public_id to post object
        req.body.post.imageId = result.public_id;
        // add author to post
        req.body.post.author = {
            id: req.user._id,
            username: req.user.username
        }


       
      if(!req.body.post.videoLink){
          req.body.post.videoLink = 'VBBrkpDp_3U'
      }  else{
        const myUrl = new URL(req.body.post.videoLink)
        const url = myUrl.searchParams.get('v')
        req.body.post.videoLink = url
      }   

        Post.create(req.body.post, function(err, post) {
           
            if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
            }
            req.flash('success', 'Post was created successfully');
            res.redirect('/posts');
        });
        });
    });

    //=================
    // SHOW MORE INFO
    //=================

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
                req.flash('success', 'Edited successfully');
                res.redirect('/posts/' + req.params.id)
            }
        })
    })


    //==============
    // DELETE
    //==============

    router.delete("/:id", function(req, res){
        Post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/posts");
        } else {
            res.redirect("/posts");
        }
        });
    });


    //===========
    //Middleware
    //===========

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

