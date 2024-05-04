require('dotenv').config();

const express = require('express');
const app = require('./public/app.js');
const path = require('path');
const bodyParser = require('body-parser');
const users = require('./public/models/users.js');
const products = require('./public/models/products.js')
const bcrypt = require('bcrypt');
const { userInfo } = require('os');
const { error } = require('console');

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
    if(req.session.authenticated && req.session.user) {
        req.user = req.session.user;
        next();
    } else {
        res.redirect('/login')
    }
};

const adminAuthenticated = (req, res, next) => {
    if(req.session.authenticated && req.session.user) {
        req.user = req.session.user;
        next();
    } else {
        res.redirect('/admin/login')
    }
};

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
    try {
        const user = await users.findOne({Email});
        if(!user) {
            console.log('User not found')
            return res.redirect('/login');
        }
    
        const userAuth = await bcrypt.compare(Password, user.Password);
        if(!userAuth) {
            console.log('Incorrect password')
            return res.redirect('/login');
        }
    
        req.session.user = user;
        console.log('User information successfully stored in session')
    
        req.session.authenticated = true;
        console.log('Redirecting to dashboard')
        res.redirect('/user-dashboard');
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).send('Server error');
    }
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
    try {
        const userInfo = req.session.user;
        if (!userInfo) {
            throw new Error('User information not found');
        }
        console.log('User information', userInfo);
        res.render('user-dashboard', {
            user: userInfo
        });
    } catch (error) {
        res.status(500).send('Server Error')
    }
});

//user dashboard
app.post("/user-dashboard", async (req, res) => {
    const { FirstName, LastName, Email, Address, Phone, Password, } = req.body;
    try{
    let user = await users.findById(req.user._id);
    
    user.FirstName = FirstName;
    user.LastName = LastName;
    user.Email = Email;
    user.Address = Address;
    user.Phone = Phone;
    user.Password = Password.passHash;

    await user.save();
    res.redirect('/user-dashboard');
    } catch (error) {
        console.error("Error updating user account", error);
        res.status(500).send("Server error");
    }
    });

app.get("/admin/request-signup", (req, res) => {
    res.render('admin-signup');
})

//create admin account
app.post("/admin/request-signup", async (req, res) => {
    const { FirstName, LastName, Email, Password } = req.body;
    
    let user = await users.findOne({Email});
    if(user) {
        return res.redirect('/admin/dashboard');
    }

    const passHash = await bcrypt.hash(Password, 12);

    user = new users ({
        FirstName,
        LastName,
        Email,
        Password: passHash,
        Admin: true
    })
    await user.save();
    res.redirect('/admin/dashboard')
});

app.get("/admin/login", (req, res) => {
    res.render('admin-login')
})

//login to admin account
app.post("/admin/login", async (req, res) => {
    const { Email, Password } = req.body;

    try {
    const user = await users.findOne({Email});
    if(!user || !user.Admin) {
        console.log('User not found')
        return res.redirect('/admin/login');
    }

    const userAuth = await bcrypt.compare(Password, user.Password);
    if(!userAuth) {
        console.log('Incorrect password')
        return res.redirect('/admin/login');
    }

    req.session.user = user;
    console.log('User information successfully stored in session')

    req.session.authenticated = true;
    console.log('Redirecting to dashboard')
    res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error');
    }
});

//admin logout route
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if(err) throw err;
        res.redirect('/admin/login')
    })
});

//display add product as admin
app.get('/admin/addproduct', adminAuthenticated, (req, res) => {
    res.render('admin-addproduct');
})

//add products to database
app.post('/admin/addproduct', async (req, res) => {
   const { BrandName, ProductName, SKU, ProductLDescription, ProductImages, ProductSizes, ProductTags, ProductPrice, InventoryStock, ProductColors } = req.body;

    const existing = await products.findOne({SKU});
    if (existing) {
        console.log('Product with this SKU already exists');
    }

   product = new products ({ 
    BrandName, 
    ProductName, 
    SKU, 
    ProductLDescription, 
    ProductImages, 
    ProductSizes, 
    ProductTags, 
    ProductPrice, 
    InventoryStock, 
    ProductColors })
    await product.save();
    console.log('Product submitted successfully!')
    res.redirect('/admin/dashboard');
})

app.delete('/delete-product', async (req, res) => {
    try {
        const id = req.body.id;
        console.log(id);
        const deleteProduct = await products.findByIdAndDelete(id);

        if (!deleteProduct) {
            res.status(404).json({ error: 'Product not found' })
        } else {
            res.json({ message: 'Product Successfully Deleted' })
        }
    } catch (error) {
        console.error('Error deleting product', error);
        res.status(500).json({ error: 'Internal server error' })
    }
});

//admin dashboard route
app.get('/admin/dashboard', adminAuthenticated, async (req, res) => {
    try {
        const userInfo = req.session.user;
        if (!userInfo) {
            throw new Error('User information not found');
        }
    
        res.render('admin-dashboard', {
            user: userInfo
        });

    } catch (error) {
        console.error('Error fetching products', error);
        res.status(500).send('Server Error')
    }
})


app.get('/admin/products', adminAuthenticated, async (req, res) => {
    try {
        const showProducts = await products.find({})
        console.log(showProducts)
        res.json(showProducts);
    } catch (error) {
        console.error('Error fetching products', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.listen(process.env.PORT || 3000, () => console.log('listening on port 3000'));
