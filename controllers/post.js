const Post = require('../models/post')
const User = require('../models/user')
const {postSchema} = require('../schemas')
const ExpressError = require('../utils/ExpressError')
const { cloudinary } = require('../cloudinary')

module.exports.getPosts = async (req, res) => {
    const following = req.user.following
    const posts = await Post.find({author: {$in: [...following, req.user._id]}}).sort({ date: -1 }).populate({path: 'comments', populate: { path: 'author' }}).populate('author')
    if(posts.length) {
        res.render('insta/index', { posts, styles: '/styles/index.css'})
    } else {
        // const users = await User.find({_id: {$ne: req.user._id}}).limit(10)
        const users = await User.find({$and: [ {_id: {$ne: req.user._id} }, { _id: { $nin: req.user.following } } ]}).limit(10)
        res.render('insta/index', { posts, users, styles: '/styles/index.css' })
    }
}

module.exports.getNewForm = (req,res) => {
    res.render('insta/new')
}

module.exports.newPost = async (req, res, next) => {
    const { error } = postSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ExpressError(400, msg))
    } else {
        if (!req.files) {
            return next(new ExpressError(400, "Image(s) required"))
        } else {
            const {caption} = req.body
            const post = new Post({ caption }); 
            post.date = new Date()
            post.author = req.user._id
            const images = req.files.map(el => ({ url: el.path, filename: el.filename }))
            post.images = images
            await post.save()
            res.redirect('/posts')
        }
    }

}

module.exports.getEditForm = async(req,res) => {
    const { id } = req.params;
    const post = await Post.findById(id)
    res.render('insta/edit', { post })
}

module.exports.updatePost = async (req,res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body)
    post.date = new Date()
    await post.save()
    res.redirect('/posts')
}

module.exports.deletePost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id)
    for (let img of post.images) {
        await cloudinary.uploader.destroy(img.filename) 
    }
    await Post.findByIdAndDelete(id)
    if (req.xhr) {
        res.send('')
    } else {
        res.redirect(`/users/${post.author._id}`)
    }
}

module.exports.likePost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id)

    if (post.likes.includes(req.user._id)){
        await Post.findByIdAndUpdate(id, {$pull: { likes: req.user._id }})
        const updatedPost = await Post.findById(id)
        res.send({like : 'unlike', likesLength: updatedPost.likes.length})
    } else {
        post.likes.push(req.user._id)
        await post.save()
        const updatedPost = await Post.findById(id)
        res.send({ like: 'like', likesLength: updatedPost.likes.length })
    }
}

module.exports.getOnePost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate('author').populate({ path: 'comments', populate: { path: 'author' } })
    res.render('insta/show', { post, styles: '/styles/post.css' })
}