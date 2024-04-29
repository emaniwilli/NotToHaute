const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');

//.env variables
const secret_key = process.env.SECRET_KEY;

mongoose.connect(process.env.DATABASE_URI, {useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to DB'))

//routers
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const wishlistRouter = require('./routes/wishlist');
const imagesRouter = require('./routes/images');
const paymentRouter = require('./routes/payment');

//models
const Users = require('./models/users');

app.use(express.json())

//Error logging with morgan
app.use(morgan('dev'));

//User authentication using ejs and passport modules
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended : true }));
app.use(session ({
    secret: secret_key,
    resave: false,
    saveUninitialized: false
}));

//initializing passport
app.use(passport.initialize());

//starting passport session
app.use(passport.session());

passport.use(Users.createStrategy());
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

//Routes handling requests
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/wishlist', wishlistRouter);
app.use('/images', imagesRouter);
app.use('/payment', paymentRouter);


module.exports = app;