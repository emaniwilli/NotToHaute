const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    WishlistQuantity: {
        type: String,
        required: true
    },
    ProductID: {
        type: Array,
        required: true
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
    ProductColor: {
        type: String,
        required: true
    },
    createdAt: {
        type:Date
    },
    updatedAt: {
        type: Date
    }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);