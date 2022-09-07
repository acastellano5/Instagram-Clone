const mongoose = require('mongoose'); 
const Comment = require('./comment');
const Schema = mongoose.Schema; 

const imageSchema = new Schema({
        url: String, 
        filename: String
})

const postSchema = new Schema({
    author: {
        ref: 'User', 
        type: Schema.Types.ObjectId
    },
    images: [
        imageSchema
    ], 
    caption: String, 
    date: Number, 
    comments: [
        {
            ref: 'Comment',
            type: Schema.Types.ObjectId
        }
    ], 
    likes: [
        {
            ref: 'User', 
            type: Schema.Types.ObjectId
        }
    ]
})

postSchema.post('findOneAndDelete', async (doc) => {
    await Comment.deleteMany({ _id: {$in: doc.comments} })
})

const Post = mongoose.model('Post', postSchema); 

module.exports = Post