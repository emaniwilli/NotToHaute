const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    UserID: {
        type: String,
        required: true
    },
    NameOnCard: {
        type: String,
        required: true
    },
    CardNumber: {
        type: String,
        required: true
    },
    Expiration: {
        type: String,
        required: true
    },
    CVV: {
        type: String,
        required: true
    },
    ZipCode: {
        type: String,
        required:true
    },
    CreatedAt: {
        type:Date,
        required: true
    },
    UpdatedAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Payment', paymentSchema);