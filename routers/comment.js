const express = require('express'); 
const catchAsync = require('../utils/catchAsync')
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware')
const comment = require('../controllers/comment')
const router = express.Router({mergeParams: true})

router.post('/', isLoggedIn, validateComment, catchAsync(comment.postComment))

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comment.deleteComment))

module.exports = router