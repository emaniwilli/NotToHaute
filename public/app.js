const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URI, {useNewURLParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to DB'))

const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const wishlistRouter = require('./routes/wishlist');
const imagesRouter = require('./routes/images');
const paymentRouter = require('./routes/payment');

app.use(express.json())

//Error logging with morgan
app.use(morgan('dev'));

//Routes handling requests
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/wishlist', wishlistRouter);
app.use('/images', imagesRouter);
app.use('/payment', paymentRouter);

/*error handling requests
app.use((req, res, next) => {
    const error = new Error('Function not valid');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});*/

module.exports = app;