const mongoose = require('mongoose')

const supportMeCommentSchema = new mongoose.Schema({
 text: String,
 image: String,
 amount: String,
 author: {
   id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
   },
   username: String
 }
});

module.exports = mongoose.model('SupportMeComment', supportMeCommentSchema)