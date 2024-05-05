const mongoose = require('mongoose');

const productsSchema = mongoose.Schema({
    ProductImages: {
        type: Array,
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
        type: String,
        required: true
    },
    SKU: {
        type: String,
        required: true
    },
    ProductSizes: {
        type: Array,
        required: true
    },
    ProductColors: {
        type: String,
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
    ProductLDescription: {
        type: String,
        required: false
    },
    CreatedAt: {
        type: Date,
        default: Date.now()
    },
    UpdatedAt: {
        type: Date,
        default: Date.now()
    },
    adminSubmit: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Products', productsSchema);