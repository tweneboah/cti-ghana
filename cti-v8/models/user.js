const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
 username: String,
 password: String,
 avatar: String,
 firstName: String,
 lastName: String,
 avatar: {
   type: Buffer
 },
 isVerified: {
  type: Boolean,
   default: false
 },
 email: String,
 isAdmin: {
  type: Boolean,
  default: false
 }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);