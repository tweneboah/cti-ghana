const mongoose = require('mongoose')

const supportMeCommentSchema = new mongoose.Schema({
 text: String,
 image: String
});

module.exports = mongoose.model('SupportMeComment', supportMeCommentSchema)