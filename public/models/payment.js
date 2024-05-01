const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
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
        default: Date.now()
    },
    UpdatedAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Payment', paymentSchema);