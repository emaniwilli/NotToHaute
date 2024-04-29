const { Decimal128, Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const productsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ProductImages: {
        type: String,
        required: true
    },
    BrandName: {
        type: String,
        required: true
    },
    ProductName: {
        type: String,
        required: true
    },
    ProductPrice: {
        type: Decimal128,
        required: true
    },
    SKU: {
        type: String,
        required: true
    },
    ProductCategory: {
        type: String,
        required: true
    },
    ProductSizes: {
        type: Array,
        required: true
    },
    ProductColors: {
        type: Array,
        required: false
    },
    InventoryStock: {
        type: String,
        required: true
    },
    ProductTags: {
        type: Array,
        required: false
    },
    ProductDescription: {
        type: String,
        required: false
    },
    CreatedAt: {
        type: Date,
        required: true
    },
    UpdatedAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Products', productsSchema);