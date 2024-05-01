require('dotenv').config();

const express = require('express');
const app = require('./public/app.js');
const path = require('path');
const bodyParser = require('body-parser');
const users = require('./public/models/users.js');
const aws = require('aws-sdk');
const bcrypt = require('bcrypt');

//middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static('public'));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()
});

const authenticated = (req, res, next) => {
    if(req.session.authenticated) {
        next()
    } else {
        res.redirect('/login')
    }
}

//aws s3 setup
const region = 'us-east-1';
const bucket = 'nottohaute';
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;



const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey
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

    const uploadUrl = await this.getSignedUrl('putObject', params);
    return uploadUrl;
};

//AWS upload link
app.get('/s3url', async (req, res) => {
    try {
        const url = await s3.generateImageUrl();
        res.send({ url });
    } catch (error) {
        console.error('Error generating image URL:', error);
        res.status(500).send('Error generating image URL');
    }
})

//home(index) route
app.get("/", (req, res) => {
    res.sendFile('public/index.html' , { root : __dirname });
});

//user route (login and signup)
app.get(["/login", "/signup"], (req, res) => {
    res.sendFile("public/login.html" , { root : __dirname })
});
//create user account
app.post("/signup", async (req, res) => {
    const { FirstName, LastName, Email, Password } = req.body;
    /*let newUser = new users ({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        Password: req.body.Password,
        Admin: false
    });
    newUser.save();*/
    
    let user = await users.findOne({Email});
    if(user) {
        return res.redirect('index');
    }

    const passHash = await bcrypt.hash(Password, 12);

    user = new users ({
        FirstName,
        LastName,
        Email,
        Password: passHash,
        Admin: false
    })
    await user.save();
    res.redirect('/')
});
//login to user account
app.post("/login", async (req, res) => {
    const { Email, Password } = req.body;

    const user = await users.findOne({Email});
    if(!user) {
        return res.redirect('/login');
    }

    const userAuth = await bcrypt.compare(Password, user.Password);
    if(!userAuth) {
        return res.redirect('/login');
    }

    req.session.authenticated = true;
    res.redirect('user-dashboard')
});

//user logout route
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if(err) throw err;
        res.redirect('/')
    })
});

//user dashboard route (secret)
app.get("/user-dashboard", authenticated, (req, res) => {
    res.render('user-dashboard');
});

//user dashboard 


//display add product as admin
app.get('/admin/addproduct', (req, res) => {
    res.render('admin-addproduct');
})

//add products to database
/*app.post('/admin/addproduct', (req, res) => {
    
})*/

app.listen(process.env.PORT || 3000, () => console.log('listening on port 3000'));
