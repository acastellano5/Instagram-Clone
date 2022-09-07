const express = require('express')
const router = express.Router()
const passport = require('passport')
const Auth = require('../controllers/auth')
const { isAlreadyLoggedIn } = require('../middleware')

router.route('/signup')
    .get(isAlreadyLoggedIn, Auth.getSignUpForm)
    .post(Auth.signUpUser)

router.route('/login')
    .get(isAlreadyLoggedIn, Auth.getLoginForm)
    .post(passport.authenticate('local', {failureRedirect: '/login', failureFlash: true, keepSessionInfo: true}), Auth.loginUser)

router.get('/logout', Auth.logoutUser)

module.exports = router