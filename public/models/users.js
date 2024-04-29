const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const usersSchema = mongoose.Schema({
    FirstName: {
        type: String
    },
    LastName: {
        type: String
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
        type: mongoose.Schema.Types.ObjectId
    },
    cartID: {
        type: mongoose.Schema.Types.ObjectId
    },
    Admin: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

usersSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Users', usersSchema);