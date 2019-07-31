const express = require('express');
const userRouter = express.Router();
const User = require('../../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs')

//Register user
userRouter.post('/users', async (req, res) => {
   try {
    //destructure
    // const { firstName, lastName, otherName, dateOfBirth, country, region, city, jobType, votersIdNo, votersIdNo, profilePhoto, email, phoneNumber, password } = req.body


    const { firstName, lastName, otherName, dateOfBirth, country, region, city, jobType, votersIdNo, passportNo, email, password, phoneNumber, visaNo, profilePhoto } = req.body



    //Check if user exist
    let user = await User.findOne({email: email});
    if(user){
     return res.status(400).json({errors : [{msg: 'User already exist'}]})
    }

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


userRouter.get('/users',  async (req, res) => {
   try {
      const users = await User.find();
      return res.json({
         users: users
      })
   } catch (error) {
       console.log(error)
   }
})

module.exports = userRouter;