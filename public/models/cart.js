const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    ProductID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products"        
    },
    ThumbnailImage: {
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
        type: String,
        required:true
    },
    ProductSize: {
        type: String,
        required: true
    },
    CartQuantity: {
        type: String,
        required: true
    },
    CartTotal: {
        type: String,
    },
    CreatedAt: {
        type:Date,
        default: Date.now()
    },
    UpdatedAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Cart', cartSchema);