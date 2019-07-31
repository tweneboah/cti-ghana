const mongoose = require('mongoose');

const userSchema = new  mongoose.Schema({
 firstName: String,
 lastName: String,
 otherName: String,
 dateOfBirth:  Date,
 country: String,
 region: String,
 city: String,
 jobDescription: String,
 passportId: String,
 votersId: String,
 visaId: String
})

const User = mongoose.model('User', userSchema);

module.exports = User;