const Post = require('../models/post')
const Comment = require('../models/comment')

module.exports.postComment = async(req, res) => {
    const { id } = req.params
    const post = await Post.findById(id).populate('comments')
    const newComment = new Comment(req.body)
    newComment.author = req.user._id
    post.comments.push(newComment)
    await post.save()
    await newComment.save()
    const comment = await Comment.findById(newComment._id).populate({ path: 'author', select: ['username', 'profilePic'] })
    res.send({comment, commentsLength: post.comments.length})
}

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params
    await Post.findByIdAndUpdate(id, {$pull: { comments: commentId }})
    await Comment.findByIdAndDelete(commentId)
    const post = await Post.findById(id)
    res.send({commentsLength: post.comments.length})
}