const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Wishlist = require('../models/wishlist');

// View Wishlist
router.get('/:id', (req, res) => {
    const id = req.params.id;
    Wishlist.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(201).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({
            message: 'Wishlist Not Found'
        });
});

})
// Add product to wishlist
router.post('/', (req, res) => {
    const wishlist = new Wishlist({
        _id: new mongoose.Types.ObjectId,
        WishlistQuantity: req.body.WishlistQuantity,
        ProductID: req.body.ProductID,
        ThumbnailImage: req.body.ThumbnailImage,
        BrandName: req.body.BrandName,
        ProductName: req.body.ProductName,
        ProductPrice: req.body.ProductPrice,
        ProductColor: req.body.ProductColor,
        CreatedAt: req.body.CreatedAt,
        UpdatedAt: req.body.UpdatedAt 
    });
    res.status(201).json({
        message: 'Document Created in Database',
        createdWishlist: wishlist
    }
    )
    wishlist.save().then(result => {
        console.log(result);
    })
    .catch(err => 
        console.log(err));
        res.status(500).json({
            message: 'Error-- check that all required fields have been entered.'
        })
})
// Delete a product from wishlist
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Wishlist.deleteOne({ _id: id })
    .exec()
    .then(result => {
        res.status(201).json({
            message: "Wishlist Deleted Successfully"
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Wishlist does not exist'
        });
     });
})

module.exports = router