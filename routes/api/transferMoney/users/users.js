const express = require('express');
const userRouter = express.Router();
const User = require('../../../../models/moneyTransfer/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../../../middleware/auth')

//Register user
userRouter.post('/users', async (req, res) => {
   try {
         //destructure
         const { firstName, lastName, otherName, dateOfBirth, country, region, city, jobType, votersIdNo, passportNo, email, password, phoneNumber, visaNo, profilePhoto } = req.body

         //Check if user exist
         let user = await User.findOne({email: email});
         if(user){
         return res.status(400).json({errors : [{msg: 'User already exist'}]})
         }

         //Create avatar 
         const avatar = gravatar.url(email, {
         s: '200',
         r: 'pg',
         d: 'mm'
         });

         //Create the user

         user = new User(
            {firstName, lastName, otherName, dateOfBirth, country, region, city, jobType, votersIdNo, passportNo, email, password, phoneNumber, visaNo, profilePhoto, avatar}
            )
      

         //Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      return res.json({
         user: user
      })

   } catch (error) {
         console.log(error.message)
   }
});


//GET ALL USERS
userRouter.get('/users', auth, async (req, res) => {
   try {
      const users = await User.find();
      return res.json({
         users: users
      })
   } catch (error) {
       console.log(error)
   }
})


//LOGIN
userRouter.post('/users/login', async(req, res) => {
    try {
         //Destructure
         const { email, password } = req.body;

         //Check if user exist
         let user = await User.findOne({email: email});
         if(!user) {
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})
         }

         //Check if password matches using bcrypt
         const isPasswordMatch = await bcrypt.compare(password, user.password);
         
         if(!isPasswordMatch) {
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]}) 
         }
         
         //Create Token for the user
         const payload = {
            user: {
               id: user.id
            }
         }

         //Sign a token
         jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 350000
         }, (err, token) => {
            if(err){
               throw err
            }else {
               return res.json({
                  token: token
               })
            }
         })


    } catch (error) {
       console.log(error.message)
       res.status(500).send('Server error')
    }
})


//Get My Profile

userRouter.get('/users/me', auth, async (req, res) => {
   try {
       const myProfile =  await User.findById(req.user.id)
        res.json({
          myProfile: myProfile
       })
   } catch (error) {
       console.log(error)
   }
})
module.exports = userRouter;