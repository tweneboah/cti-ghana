const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');
const Support = require('../models/support');
const SupportComment = require('../models/supportComment');
const middleware = require('../middleware');
const multer = require('multer');
const cloudinary = require('cloudinary');

    //=============
    //CLOUDINARY
    //=============

    const storage = multer.diskStorage({
      filename: function(req, file, callback) {
          callback(null, file.originalname);
      }
      });
      const imageFilter = function (req, file, cb) {
          // accept image files only
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
              return cb(new Error('Only image files are allowed!'), false);
          }
          cb(null, true);
      };
  
      const upload = multer({ storage: storage, fileFilter: imageFilter})

      cloudinary.config({ 
       
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY, 
          api_secret: process.env.CLOUDINARY_API_SECRET
      });
  

      

//============
 // REGISTER USER
 //Show form
 //===========
 router.get('/register', (req, res) => {
  res.render('register')
});




//Registration logic

router.post('/register', upload.single('image'), (req, res) => {
  //let newUser = new User({username: req.body.username});
  //eval(require('locus'))
  //req.body contains all the data from the form. We can save the password in our DB incase someone loose his password we can check since we don't have password reset features
cloudinary.v2.uploader.upload(req.file.path,  (err, createdImage) => {
   if(err){
     console.log(err)
   }else {

    req.body.image = createdImage.secure_url

    const newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      image: req.body.image,
      password: req.body.password
    }); //NOTE: You don't need to include password but since there is no password reset this will help if someone forget his/her password
  

    //NOTE THE WHOLE OF newUser contains the user model
    User.register(newUser, req.body.password, (err, user) => {
        console.log('USER', user)
        if(err){
          req.flash('error', err.message)
            return res.render('register')
        }else {
            passport.authenticate('local')(req, res, () =>{
              req.flash('success', 'Successfully Registered')
               res.redirect('/posts')
            });
        }
    })
   }
})
  
})

//===============
//Login form
//===============

router.get('/login', (req, res) => {
  res.render('login')
})

//=================
//Login logic
//===============
router.post('/login',passport.authenticate('local', {
  
  successRedirect: '/posts',
  failureRedirect: '/login'
}) , (req, res) => {
  req.flash('success', 'Login successful')
});


//=====================
//logout route
//=======================
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have Logout successful')
  res.redirect('/')
})

//===========================
//Display individual profile
//============================
router.get('/profile/:id', (req, res) => {

      User.findById(req.params.id, (err, foundUser) => {
          if(err){
            console.log(err)
          }else {

            Post.find().where('author.id').equals(foundUser._id).exec((err, foundPost) => {
          
              if(err){
                console.log(err)
              }else{
                console.log(foundPost)
               res.render('profile', {
                 posts: foundPost,
                 user: foundUser
               })
              }
            })
          }
      })

     })

//==========================
//List of all Users
//============================

router.get('/users', (req, res) => {
  //res.set('Content-Type', 'image/jpg')
    User.find({}, (err, allUsers) => {
        if(err){
          console.log(err)
        }else {
          console.log(allUsers)
        res.render('users.ejs', {users: allUsers})
        }
    })
});

//===========================
//List of all Executives
//===========================
router.get('/team', (req, res) => {
  //res.set('Content-Type', 'image/jpg')
    User.find({}, (err, allUsers) => {
        if(err){
          console.log(err)
        }else {
          console.log(allUsers)
        res.render('team.ejs', {users: allUsers})
        }
    })
});

//==========================
// Sika
router.get('/sikadwa', middleware.isLogin, (req, res) => {
  //res.set('Content-Type', 'image/jpg')
    User.find({}, (err, allUsers) => {
        if(err){
          console.log(err)
        }else {
          console.log(allUsers)
        res.render('sikadwa.ejs', {users: allUsers})
        }
    })
});


//====================
//SUPPORT ME
//====================

//1. Get the form
router.get('/support/new', (req, res) => {
  res.render('supportMe/supportMeForm.ejs')
})

//======================================
//2. Create Support me user Logic
//=======================================
router.post('/support', upload.single('image'), (req, res) => {

  cloudinary.v2.uploader.upload(req.file.path,  function(err, result) {
    

    if(err) {
         console.log(err)
    }else {
      // add cloudinary url for the image to the User object under image property
      req.body.supportMeUser.image = result.secure_url;
      // add image's public_id to user object
      req.body.supportMeUser.imageId = result.public_id;
      
      //Create the user with the image and save to db
      Support.create(req.body.supportMeUser, (err, user) => {
        
        if(err){
          console.log(err)
        }else {
         res.redirect('/')
         
        }
       })
     }
   })

})

//====================
// Fetch All Users that need Help
//=====================

router.get('/victims', (req, res) => {
    Support.find({}, (err, foundUserNeededHelp) => {
       if(err) {
         console.log(err)
       }else {
         res.render('supportMe/support', {user: foundUserNeededHelp})
       }
    })
})


//====================
// Users with problems comments
//=========================


//1.Show individual user who need help by ID
router.get('/victim/:id', (req, res) => {
  Support.findById(req.params.id).populate('comments').exec((err, userWithComments) => {
    if(err){
      console.log(err)
    }else {
      User.find((err, allUsers) => {
        if(err){
          console.log(err)
        }else {
          res.render('supportMe/showMore', {user: userWithComments, allUsers: allUsers})
        }
      })
     
    
    }
  })
})

//=======================================
//2. Get the comment form
//==================================
router.get('/supportMe/:id/new', middleware.isLogin, (req, res) => {
   Support.findById(req.params.id, (err, foundUserNeededHelp) => {
     if(err){
       console.log(err)
     }else {
      res.render('supportMe/supportCommentForm', {user: foundUserNeededHelp})
     }
   })
})

//===================
//Comment Logic
//===================
router.post('/support/:id/comments', middleware.isLogin, upload.single('image'), (req, res) => {
Support.findById(req.params.id, (err, userWithProblem) => {
  if(err){
    console.log(err)
  }else {
    cloudinary.v2.uploader.upload(req.file.path, (err, imageCreated) => {
      if(err){
        console.log(err)
      }else {
        //Add image from cloudinary to the comment post
        req.body.image = imageCreated.secure_url
        req.body.imageId = imageCreated.public_id
        const newComment = {
          text: req.body.text,
          amount: req.body.amount,
          image: req.body.image
        }
       //Create the comment
        SupportComment.create(newComment, (err, createdComment) => {    
          if(err){
            console.log(err)
          }else {
            //Add user/Author to the comment
            createdComment.author.id = req.user.id
           createdComment.author.username = req.user.username
           //Resave the Data again
            createdComment.save()
            userWithProblem.save()
            //Push the comment to this created post

           userWithProblem.comments.push(createdComment)
           console.log(userWithProblem)
            res.redirect('/victim/' + userWithProblem.id)
          }
        })
      }
    })
  }
})
})
    
module.exports = router;


