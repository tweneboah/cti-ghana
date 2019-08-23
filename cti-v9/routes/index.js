const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');
const middleware = require('../middleware');
const multer = require('multer');





//============
 // REGISTER USER
 //Show form
 //===========
 router.get('/register', (req, res) => {
  res.render('register')
});


const upload = multer({
  limits: {
      fileSize: 1000000
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(pdf|doc)$/)) {
          return cb(new Error('Please upload an image'))
      }

      cb(undefined, true)
  }
})

//Registration logic

router.post('/register', upload.single('avatar'), (req, res) => {
  //let newUser = new User({username: req.body.username});
  //eval(require('locus'))
  //req.body contains all the data from the form. We can save the password in our DB incase someone loose his password we can check since we don't have password reset features

  
  const newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    
  }); //This does not include password



  //NOTE THE WHOLE OF newUser contains the user model
  User.register(newUser, req.body.password, (err, user) => {
    console.log('New user created', newUser)
      if(err){
          console.log('Registration Error', err.message);
          return res.render('register')
      }else {
        console.log('Registered users', user)
          passport.authenticate('local')(req, res, () =>{
             res.redirect('/posts')
          });
      }
  })
})


//Login form
router.get('/login', (req, res) => {
 
  res.render('login')
  req.flash('success', 'Login successful')
})

//Login logic
router.post('/login',passport.authenticate('local', {
  successRedirect: '/about',
  failureRedirect: '/login'
}) , (req, res) => {
  
});

//logout route

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/posts')
})


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





module.exports = router;


