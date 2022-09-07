const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, isUser} = require('../middleware')
const multer  = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })
const Users = require('../controllers/users')

router.get('/users/:id', isLoggedIn, catchAsync(Users.getUserProfile))

router.post('/users/:id/follow/:currentUserId', isLoggedIn, catchAsync(Users.followUser))

router.post('/search', isLoggedIn, catchAsync(Users.searchUser))

router.route('/users/:id/edit')
    .get(isLoggedIn, isUser, catchAsync(Users.getEditForm))
    .patch(isLoggedIn, isUser, upload.single('profilePic'), catchAsync(Users.editUser))

router.route('/users/:id/resetPassword')
    .get(isLoggedIn, isUser, catchAsync(Users.getResetPwForm))
    .post(isLoggedIn, isUser, catchAsync(Users.resetPassword))


module.exports = router