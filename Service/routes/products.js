const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Products = require('../models/products');

// Get all products
router.get('/', (req, res) => {
   Products.find()
   .exec()
   .then(docs => {
    console.log(docs);
    res.status(200).json(docs);
   })
   .catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
   });
})
// Get one product
router.get('/:id', (req, res) => {
    const id = req.params.id;
    Products.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(201).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({
            message: 'Product Not Found'
        });
});
})
// Create a product
router.post('/', (req, res) => {
    const product = new Products({
        _id: new mongoose.Types.ObjectId,
        ProductImages: req.body.ProductImages,
        BrandName: req.body.BrandName,
        ProductName: req.body.ProductName,
        ProductPrice: req.body.ProductPrice,
        SKU: req.body.SKU,
        ProductCategory: req.body.ProductCategory,
        ProductSizes: req.body.ProductSizes,
        ProductColors: req.body.ProductColors,
        InventoryStock: req.body.InventoryStock,
        ProductTags: req.body.ProductTags,
        ProductDescription: req.body.ProductDescription,
        CreatedAt: req.body.CreatedAt,
        UpdatedAt: req.body.UpdatedAt 
    });
    res.status(201).json({
        message: 'Document Created in Database',
        createdProduct: product
    }
    )
    product.save().then(result => {
        console.log(result);
    })
    .catch(
        res.status(500).json({
            message: 'Error-- check that all required fields have been entered.'
        }),
        err => console.log(err));
})
// Update a product
router.patch('/:id', (req, res) => {
    const id = req.params.id;
    const easyUpdate = {};
    for (const ops of req.body) {
        easyUpdate[ops.propName] = ops.value;
    }
    Products.updateOne({ _id: id }, {$set: easyUpdate})
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
// Delete a product
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Products.deleteOne({ _id: id })
    .exec()
    .then(result => {
        res.status(201).json({
            message: "Product Deleted Successfully"
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Product does not exist'
        });
    });
})

module.exports = router