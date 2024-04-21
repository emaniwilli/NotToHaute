const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Payment = require('../models/payment');

// Get all payment methods
router.get('/', (req, res) => {
    Payment.find()
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
// Get one payment method
router.get('/:id', (req, res) => {
    const id = req.params.id;
    Payment.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(201).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({
            message: 'Payment method doesn\'t exist'
        });
    });
})
// Add a payment method
router.post('/', (req, res) => {
    const payment = new Payment({
        _id: new mongoose.Types.ObjectId,
        UserID: req.body.UserID,
        NameOnCard: req.body.NameOnCard,
        CardNumber: req.body.CardNumber,
        Expiration: req.body.Expiration,
        CVV: req.body.CVV,
        ZipCode: req.body.ZipCode,
        CreatedAt: req.body.CreatedAt,
        UpdatedAt: req.body.UpdatedAt 
    });
    res.status(201).json({
        message: 'Document Created in Database',
        createdPayment: payment
    }
    )
    payment.save().then(result => {
        console.log(result);
    })
    .catch(err => 
        console.log(err));
        res.status(500).json({
            message: 'Error-- check that all required fields have been entered.'
        })
})
// Update a payment method
router.patch('/:id', (req, res) => {
    const id = req.params.id;
    const easyUpdate = {};
    for (const ops of req.body) {
        easyUpdate[ops.propName] = ops.value;
    }
    Payment.updateOne({ _id: id }, {$set: easyUpdate})
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
// Delete a payment method
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Payment.deleteOne({ _id: id })
    .exec()
    .then(result => {
        res.status(201).json({
            message: "Payment Method Deleted Successfully"
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Payment Method does not exist'
        });
     });
})

module.exports = router