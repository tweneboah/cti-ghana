const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
 username: String,
 firstname: String,
 lastname: String,
 description: String,
 image: String
 
});
module.exports = mongoose.model('Support', supportSchema);


