const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user')


//============
 // REGISTER USER
 //Show form
 //===========
 router.get('/register', (req, res) => {
  res.render('register')
});

//Registration logic

router.post('/register', (req, res) => {
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
      if(err){
          console.log('Registration Error', err.message);
          return res.render('register')
      }else {
          passport.authenticate('lpcal')(req, res, () =>{
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





module.exports = router;


