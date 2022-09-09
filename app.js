if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose'); 
const path = require('path')
const ejsMate = require('ejs-mate')
const postRouter = require('./routers/post')
const commentRouter = require('./routers/comment')
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const formatDistance = require('date-fns/formatDistance')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const authRouter = require('./routers/auth')
const usersRouter = require('./routers/users')
const flash = require('connect-flash')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const MongoStore = require('connect-mongo');
// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/InstagramClone'
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/InstagramClone'
const localUrl = 'mongodb://localhost:27017/InstagramClone';

if (process.env.NODE_ENV === 'production') {
    mongoose.connect(dbUrl)
    .then(() => {
        console.log('DB CONNECTED')
    })
    .catch(e => {
        console.log('DB CONNECTION ERROR')
        console.log(e)
    })
} else {
    mongoose.connect(localUrl)
    .then(() => {
        console.log('DB CONNECTED')
    })
    .catch(e => {
        console.log('DB CONNECTION ERROR')
        console.log(e)
    })
}

// mongoose.connect(dbUrl)
//     .then(() => {
//         console.log('DB CONNECTED')
//     })
//     .catch(e => {
//         console.log('DB CONNECTION ERROR')
//         console.log(e)
//     })

app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.use(mongoSanitize());

const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://cdnjs.cloudflare.com/"
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/"
];
const connectSrcUrls = [];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/desmhdpr3/", 
                "https://images.unsplash.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// const secret = process.env.SECRET || 'secret'
const secret = process.env.SECRET || 'secret'
const localSecret = 'secret'

if (process.env.NODE_ENV === 'production') {
    const store = MongoStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 60 * 60,
        crypto: {
            secret
        }
    });
    
    store.on("error", function(e) {
        console.log("SESSION STORE ERROR", e)
    })
    
    app.use(session({
        store,
        name: 'session',
        secret, 
        resave: false, 
        saveUninitialized: true, 
        cookie: {
            httpOnly: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    }))
} else {
    const store = MongoStore.create({
        mongoUrl: localUrl,
        touchAfter: 24 * 60 * 60,
        crypto: {
            secret: localSecret
        }
    });
    
    store.on("error", function(e) {
        console.log("SESSION STORE ERROR", e)
    })
    
    app.use(session({
        store,
        name: 'session',
        secret: localSecret, 
        resave: false, 
        saveUninitialized: true, 
        cookie: {
            httpOnly: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    }))
}

// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     touchAfter: 24 * 60 * 60,
//     crypto: {
//         secret
//     }
// });

// store.on("error", function(e) {
//     console.log("SESSION STORE ERROR", e)
// })

// app.use(session({
//     store,
//     name: 'session',
//     secret, 
//     resave: false, 
//     saveUninitialized: true, 
//     cookie: {
//         httpOnly: true,
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//         maxAge: 1000 * 60 * 60 * 24 * 7
//     }
// }))


app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))

// uses the user's id in session instead of the username to keep track of who's logged in
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });


app.use((req, res, next) => {
    if (req.originalUrl === '/') {
        return res.redirect('/login')
    }
    res.locals.formatDistance = formatDistance
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    res.locals.currentUser = req.user
    if (!['/login', '/signup', '/logout', '/search', '/'].includes(req.originalUrl) && req.method === 'GET') {
        req.session.redirect = req.originalUrl
    }
    next()
})

app.use('/posts', postRouter)
app.use('/posts/:id/comments', commentRouter)
app.use('/', authRouter)
app.use('/', usersRouter)

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page not found'))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', { err })
})

// const port = process.env.PORT || 3000
const port = process.env.PORT || 3000
const localPort = 3000

if (process.env.NODE_ENV === 'production') {
    app.listen(port, () => {
        console.log('SERVER IS LIVE')
    })
} else {
    app.listen(localPort, () => {
        console.log('SERVER IS LIVE')
    })
}

// app.listen(port, () => {
//     console.log(`SERVER IS LIVE ON PORT ${port}`)
// })