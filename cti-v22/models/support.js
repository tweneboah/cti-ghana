const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
 username: String,
 firstname: String,
 lastname: String,
 description: String,
 image: String,
 comments: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportMeComment'
   }
]
});
module.exports = mongoose.model('Support', supportSchema);


