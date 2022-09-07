const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    author: {
        ref: 'User', 
        type: Schema.Types.ObjectId
    },
    text: String
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment