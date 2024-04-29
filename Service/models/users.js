const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    Address: {
        type: Array,
        required: false,
    },
    Phone: {
        type: String,
        required: false,
    },
    wishlistID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Wishlist"
    },
    cartID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Cart"
    },
    Admin: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Timestamp,
    },
    updatedAt: {
        type: Timestamp,
    }
});

module.exports = mongoose.model('Users', usersSchema);