require('dotenv').config();

const express = require('express');
const app = require('./public/app.js');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const users = require('./public/models/users.js');
const { error } = require('console');
const passport = require('passport');
const aws = require('aws-sdk');
/*const server = http.createServer(app);*/

//middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static('public'));

//aws s3 setup
const region = 'us-east-1';
const bucket = 'nottohaute';
const AWS_Access = process.env.AWS_ACCESS_KEY;
const AWS_Secret = process.env.AWS_SECRET_KEY;

const s3 = new aws.S3({
    region,
    AWS_Access,
    AWS_Secret,
    signatureVersion: 'v4'
})

//image upload
s3.generateImageUrl = async function () {
    let date = new Date();
    let id = parseInt(Math.random() * 100000000000);

    const imageName = `${id}${date.getTime()}.png`;

    const params = {
        ACL: 'public-read',
        Bucket: bucket,
        Key: imageName,
        Expires: 300,
        ContentType: 'image/png'
    };

    const uploadUrl = await this.getSignedUrlPromise('putObject', params);
    return uploadUrl;
};


//home(index) route
app.get("/", (req, res) => {
    res.sendFile('public/index.html' , { root : __dirname });
});

//user route (login and signup)
app.get(["/login", "/signup"], (req, res) => {
    if (req.isAuthenticated()) {
        res.send("You have already logged in");
    }
    else {
        res.sendFile("public/login.html" , { root : __dirname })
    }
});
//create user account
app.post("/signup", (req, res) => {
    let newUser = new users ({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        Password: req.body.Password,
        Admin: false
    });
    newUser.save();
    if (error) {
        console.log(error);
    }
    else{ 
        passport.authenticate("local")
        (req, res, function() {
            res.send("successfully saved");
        })
    }
    //res.redirect('/user-dashboard');
});
//login to user account
app.post("/login", async (req, res) => {
    try {
        //looking for user account
        const userAccount = await users.findOne({ Email: req.body.Email });
        if (userAccount) {
            //checking if password matches email
            const result = req.body.Password === userAccount.Password;
            if (result) {
                res.redirect('/user-dashboard');
            } else {
                res.status(400).json({ error: "password doesn't match records"})
            }
        } else {
            res.status(400).json({ error: "User does not exist"});
        }
        }
        catch (error) {
            res.status(400).json({ error });
        }
    }
);

//user logout route
app.get("/logout", (req, res) => {
    req.logout(function(err) {
        if(err) { return next(err); }
        res.redirect("/");
    });
});

//user dashboard route (secret)
app.get("/user-dashboard", (req, res) => {
    res.render('user-dashboard');
});

//user dashboard 

//AWS upload link
app.get('/s3url', async (req, res) => {
    const url = await s3.generateImageUrl() 
    res.send({url})
})

//add product as admin
app.get('/admin/addproduct', (req, res) => {
    res.render('admin-addproduct');
})


app.listen(process.env.PORT || 3000, () => console.log('listening on port 3000'));
