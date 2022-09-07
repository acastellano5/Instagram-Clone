const express = require('express'); 
const router = express.Router(); 
const catchAsync = require('../utils/catchAsync')
const { validatePost } = require('../middleware')
const post = require('../controllers/post')
const { isLoggedIn, isPostAuthor } = require('../middleware')
const multer  = require('multer')
const { storage, cloudinary } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(isLoggedIn, catchAsync(post.getPosts))
    .post(isLoggedIn, upload.array('image'), catchAsync(post.newPost))

router.get('/new', isLoggedIn, post.getNewForm)

router.route('/:id')
    .get(isLoggedIn, catchAsync(post.getOnePost))
    .put(isLoggedIn, isPostAuthor, validatePost, catchAsync(post.updatePost))
    .delete(isLoggedIn, isPostAuthor, catchAsync(post.deletePost))

router.get('/:id/edit', isLoggedIn, isPostAuthor, catchAsync(post.getEditForm))

router.post('/:id/likes', isLoggedIn, catchAsync(post.likePost))


module.exports = router