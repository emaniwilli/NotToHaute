const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
        type: Decimal128,
        required:true
    },
    ProductColor: {
        type: String,
        required: true
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
        type: Decimal128,
        required: true
    },
    CreatedAt: {
        type:Date,
    },
    UpdatedAt: {
        type: Date,
    }
});

module.exports = mongoose.model('Cart', cartSchema);