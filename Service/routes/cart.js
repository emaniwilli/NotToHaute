const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cart = require('../models/cart');

// Get cart
router.get('/:id', (req, res) => {
    const id = req.params.id;
    Cart.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(201).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({
            message: 'Cart Not Found'
        });
});
})
// Add product to cart
router.post('/', (req, res) => {
    const cart = new Cart({
        _id: new mongoose.Types.ObjectId,
        ProductID: req.body.ProductID,
        ThumbnailImage: req.body.ThumbnailImage,
        BrandName: req.body.BrandName,
        ProductName: req.body.ProductName,
        ProductPrice: req.body.ProductPrice,
        ProductColor: req.body.ProductColor,
        ProductSize: req.body.ProductSize,
        CartQuantity: req.body.CartQuantity,
        CartTotal: req.body.CartTotal,
        CreatedAt: req.body.CreatedAt,
        UpdatedAt: req.body.UpdatedAt 
    });
    res.status(201).json({
        message: 'Document Created in Database',
        createdCart: cart
    }
    )
    cart.save().then(result => {
        console.log(result);
    })
    .catch(err => 
        console.log(err));
        res.status(500).json({
            message: 'Error-- check that all required fields have been entered.'
        })
})
// Update product in cart
router.patch('/:id', (req, res) => {
    const id = req.params.id;
    const easyUpdate = {};
    for (const ops of req.body) {
        easyUpdate[ops.propName] = ops.value;
    }
    Cart.updateOne({ _id: id }, {$set: easyUpdate})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
})
// Delete item in cart
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Cart.deleteOne({ _id: id })
    .exec()
    .then(result => {
        res.status(201).json({
            message: "Cart Deleted Successfully"
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Cart does not exist'
        });
     });
})

module.exports = router