const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = require('../models/users');

// Get one user
router.get('/:id', (req, res) => {
    const id = req.params.id;
    Users.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(201).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({
            message: 'User Not Found'
        });
});
})
// Create a user
router.post('/', (req, res) => {
    const user = new Users({
        _id: new mongoose.Types.ObjectId,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        Password: req.body.Password,
        Address: req.body.Address,
        Phone: req.body.Phone,
        Wishlist: req.body.Wishlist,
        Cart: req.body.Cart,
        Admin: req.body.Admin,
        CreatedAt: req.body.CreatedAt,
        UpdatedAt: req.body.UpdatedAt 
    });
    res.status(201).json({
        message: 'Document Created in Database',
        createdUser: user
    }
    )
    user.save().then(result => {
        console.log(result);
    })
    .catch(err => 
        console.log(err));
        res.status(500).json({
            message: 'Error-- check that all required fields have been entered.'
        })
})
// Update a user
router.patch('/:id', (req, res) => {
    const id = req.params.id;
    const easyUpdate = {};
    for (const ops of req.body) {
        easyUpdate[ops.propName] = ops.value;
    }
    Users.updateOne({ _id: id }, {$set: easyUpdate})
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
// Delete a user
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Users.deleteOne({ _id: id })
    .exec()
    .then(result => {
        res.status(201).json({
            message: "User Deleted Successfully"
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'User does not exist'
        });
     });
});

module.exports = router