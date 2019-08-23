    require('dotenv').config()
    const express = require("express");
    const app = express();
    const bodyParser = require("body-parser");
    const flash = require('connect-flash');
    const mongoose = require('mongoose');
    const User = require('./models/user');
    const middleware = require('./middleware/index')
    //const seed = require('./seed');
    const passport = require('passport');
    const LocalStrategy = require('passport-local')
    const methodOverride = require('method-override')

    //requiring routes
    const commentsRoutes = require('./routes/comments');
    const postRoutes = require('./routes/post')
    const indexRoutes = require('./routes/index')


    //MIDLLEWARES
    app.use(bodyParser.urlencoded({extended: true}));
    //Serving static files
    app.use(express.static(__dirname + "/public"));
    app.set("view engine", "ejs");
    app.use(methodOverride('_method')); //is by default
    app.locals.moment = require('moment');
    app.use(flash());


    //======================
    // DB CONNECTION
    //==============

    const url = process.env.DATABASEURL || 'mongodb://localhost/CTI-Ghana'

    mongoose.connect( url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
    })
    .then(() => console.log("DB Connected successfully"));


    //============
    // CONGIGURING PASSPORT
    //==================

    app.use(require('express-session')({
        secret: 'Am on the way',
        resave:  false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    //Passing the authenticated user - req.user to every routs
    app.use(function(req, res, next) {
        //Whatever we put into res.local is what available in our templates
        res.locals.currentUser = req.user; 
        res.locals.error = req.flash('error') //.error holds all the error message in our routes.Anywhere i placed <%=error%> it will display all the messages inside the error variable in our  routes
    res.locals.success = req.flash('success') ///.success holds all the success message in our routes  
        next()

    })

    //====================
    // HOME PAGE
    //====================

    app.get("/", function(req, res){
        res.render("landing");
    });

    //ABOU US
    app.get('/about', middleware.isLogin ,(req, res) => {
        res.render('about')
    })


    //USING ROUTES
    app.use('/', indexRoutes);
    app.use('/posts', postRoutes);
    app.use('/posts/:id/comments', commentsRoutes)

    //=================
    // SERVER
    //=================

    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
    console.log(`The server has started on port ${PORT}`)
    });