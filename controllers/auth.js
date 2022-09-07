const User = require('../models/user')

module.exports.getSignUpForm = (req, res) => {
    res.render('auth/signup')
}

module.exports.signUpUser = async (req, res, next) => {
    try {
        const { username, fullName } = req.body
        if (username[0] === '.' || username[0] === '$') {
            req.flash('error', 'Username cannot begin with $ or .')
            res.redirect('/signup')
        } else {
            const user = { username, fullName }
            const password = req.body.password
            const newUser = await User.register(user, password)
            newUser.profilePic = {
                url: 'https://res.cloudinary.com/desmhdpr3/image/upload/v1660766640/InstaClone/ghf9j3x4htddsstkxnpa.jpg', 
                filename: 'InstaClone/ghf9j3x4htddsstkxnpa'
            }
            await newUser.save()
            req.login(newUser, function(err) {
                if (err) {
                    next(err)
                } else {
                    res.redirect('/posts')
                }
            })
        }
    } catch (error) {
        req.flash('error', `${error.message}`)
        res.redirect('/signup')
    }
}

module.exports.getLoginForm = (req, res) => {
    res.render('auth/login')
}

module.exports.loginUser = (req, res) => {
    const redirect = req.session.redirect || '/posts'
    res.redirect(redirect)
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function(err) {
        if (err) { 
            next(err); 
        } else {
            res.redirect('/login');
        }
    });
}