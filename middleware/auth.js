const jwt = require('jsonwebtoken');
const config = require('config')

module.exports = function(req, res, next) {
  
  try {

     //Get token from the header
     const token = req.header('x-auth-token');

     //check if there is a token
     if(!token) {
       return res.status(401).json({msg: 'No token, authorization denied'})
     }

       //verify token
       const decoded = jwt.verify(token, config.get('jwtSecret'));
      //Since the request is an object we will attach the verify user to it 
       req.user = decoded.user //The user here is from the payload object
       next()
  } catch (error) {
       res.status(401).json({ msg: 'Token is not valid' })
    }
};