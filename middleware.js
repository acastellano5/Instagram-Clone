const { postSchema, commentSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Post = require('./models/post')
const Comment = require('./models/comment')
const User = require('./models/user')

module.exports.validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        next(new ExpressError(400, msg))
    } else {
        next()
    }
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        next(new ExpressError(400, msg))
    } else {
        next()
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in first')
        if (req.xhr) {
            res.json({redirect: '/login'})
        } else {
            res.redirect('/login')
        }
    } else {
        next()
    }
}

module.exports.isPostAuthor = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id)
    if (!post.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        if (req.xhr) {
            res.json({redirect: '/posts'})
        } else {
            res.redirect('/posts')
        }
    } else {
        next()
    }
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId)
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        if (req.xhr) {
            res.json({redirect: '/posts'})
        } else {
            res.redirect('/posts')
        }
    } else {
        next()
    }
}

module.exports.isUser = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id)
    if (!user._id.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        if (req.xhr) {
            res.json({redirect: '/posts'})
        } else {
            res.redirect('/posts')
        }
    } else {
        next()
    }
}

module.exports.isAlreadyLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/posts')
    }
}