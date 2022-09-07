const User = require('../models/user')
const Post = require('../models/post')
const { userSchema } = require('../schemas')
const ExpressError = require('../utils/ExpressError')
const { cloudinary } = require('../cloudinary')

module.exports.getUserProfile = async(req, res) => {
    const { id } = req.params
    const user = await User.findById(id)
    const posts = await Post.find({author: user._id}).sort({ date: -1 })
    res.render('user/show', {user, posts, styles: '/styles/profile.css'})
}

module.exports.followUser = async(req, res) => {
    const { id, currentUserId } = req.params;
    const user = await User.findById(id)
    const currentUser = await User.findById(currentUserId)
    if (!user.followers.includes(currentUser._id)) {
        user.followers.push(currentUser._id)
        currentUser.following.push(user._id)
        await user.save()
        await currentUser.save()
        const followersLength = await User.findById(id)
        res.json({following: true, followersLength : followersLength.followers.length})
    } else {
        await User.findByIdAndUpdate(id, {$pull: {followers: currentUser._id}})
        await User.findByIdAndUpdate(currentUserId, {$pull: {following: user._id}})
        const followersLength = await User.findById(id)
        res.json({following: false, followersLength : followersLength.followers.length})
    }
}

module.exports.searchUser = async(req, res) => {
    const { username } = req.body
    const user = await User.findOne({username: new RegExp('^'+username+'$', "i")})
    if (user) {
        const posts = await Post.find({author: user._id}).sort({ date: -1 })
        res.render('user/show', {user, posts, styles: '/styles/profile.css'})
    } else {
        req.flash('error', 'No users found')
        const redir = req.session.redirect || '/posts'
        res.redirect(redir)
    }
}

module.exports.getEditForm = async(req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)
    res.render('user/edit', { user })
}

module.exports.editUser = async(req, res, next) => {
    const { error } = userSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        next(new ExpressError(400, msg))
    } else {
        // updating user
        const { id } = req.params;
        const { fullName, username, bio } = req.body
        try {
            await User.findByIdAndUpdate(id, {fullName, username, bio})
            const user = await User.findById(id)
            if (req.file) {
                if (user.profilePic.filename !== 'InstaClone/ghf9j3x4htddsstkxnpa' && user.profilePic.url !== 'https://res.cloudinary.com/desmhdpr3/image/upload/v1660766640/InstaClone/ghf9j3x4htddsstkxnpa.jpg') {
                    await cloudinary.uploader.destroy(user.profilePic.filename)     
                }
                user.profilePic = {
                    url: req.file.path,
                    filename: req.file.filename
                }
                await user.save()
            }
            res.redirect(`/users/${id}`)
        } catch (error) {
            if (error.codeName === 'DuplicateKey') {
                req.flash('error', 'Username already taken')
                res.redirect(`/users/${id}/edit`)
            } else {
                next(error)
            }
        }
    }
}

module.exports.getResetPwForm = async (req, res) => {
    const { id } = req.params; 
    const user = await User.findById(id)
    res.render('user/password', { user })
}

module.exports.resetPassword = async (req,res) => {
    const { id } = req.params;
    const { oldPw, newPw } = req.body
    const user = await User.findById(id)
    user.changePassword(oldPw, newPw, function(err) {
        if (err) {
            req.flash('error', err.message)
            res.redirect(`/users/${user._id}/resetPassword`)
        } else {
            req.flash('success', 'Succesfully reset your password')
            res.redirect(`/users/${user._id}`)
        }
    })
}