const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    username: {
        type: String, 
        unique: true
    },
    followers: [
        {
            ref: 'User', 
            type: Schema.Types.ObjectId
        }
    ], 
    following: [
        {
            ref: 'User', 
            type: Schema.Types.ObjectId
        }
    ], 
    fullName: String, 
    bio: String,
    profilePic: {
        url: String, 
        filename: String
    }
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', userSchema)
module.exports = User