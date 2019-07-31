const mongoose = require('mongoose');

const userSchema = new  mongoose.Schema({
 firstName: String,
 lastName: String,
 otherName: String,
 dateOfBirth:  String,
 country: String,
 email: String,
 password: String,
 phoneNumber: String,
 region: String,
 city: String,
 jobType: String,
 passportNo: String,
 visaNo: String,
 profilePhoto: String
})

const User = mongoose.model('User', userSchema);

module.exports = User;