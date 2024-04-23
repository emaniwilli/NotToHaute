require('dotenv').config();

const express = require('express');
const app = require('./public/app');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const users = require('./public/models/users');
/*const server = http.createServer(app);*/

//middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static('public'));

//home(index) route
app.get("/", (req, res) => {
    res.sendFile('public/index.html' , { root : __dirname });
});

//login and signup route
app.get("/login", (req, res) => {
    res.sendFile('public/login.html' , { root : __dirname });
});

app.post("/login", (req, res) => {
    let newUser = new users ({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        Password: req.body.Password,
        Admin: false
    });
    newUser.save();
    res.redirect('/user-dashboard')
})

app.get("/user-dashboard", (req, res) => {
    res.sendFile('public/user-dashboard.html' , { root : __dirname });
});

app.listen(process.env.PORT || 3000, () => console.log('listening on port 3000'));
