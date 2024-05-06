require('dotenv').config();

const express = require('express');
const app = require('./public/app.js');
const path = require('path');
const bodyParser = require('body-parser');
const users = require('./public/models/users.js');
const products = require('./public/models/products.js')
const bcrypt = require('bcrypt');
const cart = require('./public/models/cart.js');

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
    res.render('index');
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
        const { Email, Password } = req.body;
        const user = await users.findOne({Email});
        if(!user) {
            console.log('User not found')
            return res.redirect('/login');
        }

        if (user.Admin) {
            console.log('Admin cannot sign in as user');
            return res.redirect('/login')
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
app.post("/user-dashboard", authenticated, async (req, res) => {
    const { FirstName, LastName, Email, Address, Phone, Password } = req.body;
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

app.get('/user/addproduct', authenticated, (req, res) => {
    res.render('user-addproducts')
})    

app.post('/user/addproduct', async (req, res) => {
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
        ProductColors,
        adminSubmit: false
    })
        await product.save();
        console.log('Product submitted successfully!')
        res.redirect('/user-dashboard');
});

app.get('/user/addproduct/:id', authenticated, (req, res) => {
    res.render('user-addproduct');
})

app.post('/user/getproduct', authenticated, async (req, res) => {
    try {
        const productId = req.body.id;
        console.log('Product ID:', productId);
        const productData = await products.findByIdAndUpdate(productId);
        console.log('Product Data:', productData);
        res.json(productData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' })
    }
    
})

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
    if(!user.Admin) {
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
    ProductColors,
    adminSubmit: true
 })
    await product.save();
    console.log('Product submitted successfully!')
    res.redirect('/admin/dashboard');
})

app.get('/admin/addproduct/:id', adminAuthenticated, (req, res) => {
    res.render('admin-addproduct');
})

app.post('/getproducts', adminAuthenticated, async (req, res) => {
    try {
        const productId = req.body.id;
        console.log('Product ID:', productId);

        const { BrandName, ProductName, SKU, ProductLDescription, ProductImages, ProductSizes, ProductTags, ProductPrice, InventoryStock, ProductColors } = req.body;
        const updateData = {
            BrandName, 
            ProductName, 
            SKU, 
            ProductLDescription, 
            ProductImages, 
            ProductSizes, 
            ProductTags, 
            ProductPrice, 
            InventoryStock, 
            ProductColors
        }
        const updatedItem = await products.findByIdAndUpdate(productId, updateData, { new: true });
        console.log('Product Data:', updatedItem);
        res.json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' })
    }
})

app.delete('/delete-product', async (req, res) => {
    try {
        const id = req.body.id;
        //console.log(id);
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
        const showProducts = await products.find({ adminSubmit: true })
        //console.log(showProducts)
        res.json(showProducts);
    } catch (error) {
        console.error('Error fetching products', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.get('/retail-products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await products.findById(id);
        res.render('retail-products', { product: product });
    } catch (error) {
        console.error('Error displaying product');
    }
})

app.get('/allproducts', async (req, res) => {
    try {
        const displayAll = await products.find({ adminSubmit: true });
        console.log('Displaying products:', displayAll)
        res.render('retail-product-all', { products: displayAll }); 
    } catch (error) {
    console.error('Error fetching products', error);
    res.status(500).json({ error: 'Server Error' });
}
})

app.get('/marketplace/products', async (req, res) => {
    try {
        const displaySubmissions = await products.find({ adminSubmit: false });
        res.render('marketplace-products', { products: displaySubmissions }); 
    } catch (error) {
    console.error('Error fetching products', error);
    res.status(500).json({ error: 'Server Error' });
}
})

app.get('/products/womenswear', async (req, res) => {
    try {
        const showWomens = await products.find({ ProductTags: 'womens' }).toArray();
        res.render('womens-products', { products: showWomens }); 
    } catch (error) {
    console.error('Error fetching products', error);
    res.status(500).json({ error: 'Server Error' });
}
})

app.get('/cart', authenticated, async (req, res) => {
    try {
        const cartProducts = await cart.find({});
        console.log(cartProducts);
        if (req.xhr){
            res.json(cartProducts);
        } else {
            res.render('cart', { cart: cartProducts });
        }
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Server error' })
    }
})

app.post('/cart/add', authenticated, async (req, res) => {
    try {
        const { productId, ThumbnailImage, BrandName, ProductName, ProductPrice, ProductSize, CartQuantity, CartTotal } = req.body;
        const cartProduct = new cart ({
            ProductID: productId,
            ThumbnailImage,
            BrandName,
            ProductName,
            ProductPrice,
            ProductSize,
            CartQuantity,
            CartTotal,
            UserId: req.user._id
        });
        await cartProduct.save();

        req.session.cart = req.session.cart || [];
        req.session.cart.push(cartProduct);

        res.status(200).json({ message: 'Product added to cart!' })
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(500).json({ error: 'Server error' })
        }  
})

app.delete('/cart/delete/:id', authenticated, async (req, res) => {
    try {
        const id = req.params.id;
        //console.log(id);
        const deleteItem = await cart.findByIdAndDelete(id);

        if (!deleteItem) {
            res.status(404).json({ error: 'Product not found' })
        } else {
            res.json({ message: 'Product Successfully Deleted' })
        }
    } catch (error) {
        console.error('Error deleting product', error);
        res.status(500).json({ error: 'Internal server error' })
    }
})

app.listen(process.env.PORT || 3000, () => console.log('listening on port 3000'));
