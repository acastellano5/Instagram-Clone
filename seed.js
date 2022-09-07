const mongoose = require('mongoose'); 
const Post = require('./models/post')
mongoose.connect('mongodb://localhost:27017/InstagramClone')
    .then(() => {
        console.log('DB CONNECTED')
    })
    .catch(e => {
        console.log('DB CONNECTION ERROR')
        console.log(e)
    })

const seedDB = async () => {
    await Post.deleteMany({})
    for (let i = 0; i < 15; i++) {
        const post = new Post({
            author: '62fbf0ed99202746e68cf9e1',
            image: 'https://images.unsplash.com/photo-1506125840744-167167210587?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=898&q=80', 
            caption: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.', 
            date: new Date()
        })
    
        await post.save()
    }

    mongoose.connection.close()
}

seedDB()