const express = require('express'),
      app = express(),
      session = require('express-session'),
      MemoryStore = require('memorystore')(session),
      cors = require('cors'),
      cookieParser = require('cookie-parser'),
      path = require('path'),
      passport = require('passport'),
      MenuItem = require('./models/menuItem'),
      User = require('./models/user.js'),
      Category = require('./models/category'),
      JoinToken = require('./models/joinToken'),
      middleware = require('./middleware'),
      dotenv = require('dotenv').config(),
      mongoose = require('mongoose'),
      crypto = require('crypto');

const baseURL = process.env.NODE_ENV === 'production' ? 'https://burger-barn-1827.herokuapp.com' : 'http://localhost:3000';
// App config
app.use(express.urlencoded({extended: true}));
// parse application/json
app.use(express.json());
// middleware for allowing react to fetch() from server
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, OPTIONS');
    next();
});

// CONNECT TO MONGODB
mongoose.connect(process.env.URI, {useNewUrlParser: true, useUnifiedTopology: true});

// CORS setup
app.use(cors({
    origin: baseURL,
    credentials: true
}));
// Session
app.use(session({
    cookie: { sameSite: "lax" },
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    credentials: true
}));
// Cookies
app.use(cookieParser(process.env.SESSION_SECRET));

// Setup passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy()); // Using this shortcut, we do not need const LocalStrategy = require('passport-local').Strategy
// To use with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Fetch menu
app.get('/api/menu', (req, res) => {
    MenuItem.find((err, menu) => {
        if(err) return res.json({menu: {error: 'Error fetching menu'}});
        Category.find((err, categories) => {
            if(err) return res.json({menu: {error: 'Error fetching categories'}});
            return res.json({menu: menu, categories: categories});
        })
    })
});

// Add menu item
app.post('/api/menu', middleware.isLoggedIn, (req, res) => {
    MenuItem.find({category: req.body.category}, (err, menu) => {
        const order = menu.length > 0 ? menu.length : 0;
        const newItem = {
            name: req.body.name,
            category: req.body.category,
            prices: [[req.body.priceDesc1, req.body.price1], [req.body.priceDesc2, req.body.price2], [req.body.priceDesc3, req.body.price3]],
            description: req.body.description,
            order: order
        }
        MenuItem.create(newItem, (err, itemCreated) => {
            if(err) return res.json({error: 'Error creating item'});
        
            res.json({success: 'New item created'});
        })
    })
});

// Update order of menu items
app.post('/api/menu/edit/order', middleware.isLoggedIn, (req, res) => {
    const itemsToUpdate = req.body;
    const jsonMessage = '';

    for(let el of itemsToUpdate) {
        MenuItem.findByIdAndUpdate(el.id, { order: el.order }, (err, itemUpdated) => {
            if(err) {
                jsonMessage = {error: 'Error creating item'}
                return
            }
        })
    }

    jsonMessage ? res.json(jsonMessage) : res.json({success: 'Items successfully updated'})
});

// Save changes to menu item
app.post('/api/menu/edit/:id', middleware.isLoggedIn, (req, res) => {
    const item = {
        name: req.body.name,
        category: req.body.category,
        prices: [[req.body.priceDesc1, req.body.price1], [req.body.priceDesc2, req.body.price2], [req.body.priceDesc3, req.body.price3]],
        description: req.body.description,
        order: req.body.order
    }
    MenuItem.findByIdAndUpdate(req.params.id, item, (err, itemUpdated) => {
        if(err) return res.json({error: 'Error creating item'});
    
        return res.json({success: 'Item successfully updated'});
    })
});

// Delete menu item
app.post('/api/menu/:id', middleware.isLoggedIn, (req, res) => {
    MenuItem.findByIdAndDelete(req.params.id, err => {
        if(err) return res.json({error: 'Error deleting item'});

        return res.json({success: 'Item successfully updated'});
    })
});

//// Add category
//app.post('/api/menu/category', middleware.isLoggedIn, (req, res) => {
//
//});
//
//// Edit category
//app.put('/api/menu/category/:id', middleware.isLoggedIn, (req, res) => {
//    
//});
//
//// Delete category
//app.delete('/api/menu/category/:id', middleware.isLoggedIn, (req, res) => {
//    
//});

// Handle registration logic
// TOKEN REQUIRED TO REGISTER
app.post('/register', (req, res, next) => {
    const userInfo = {
        firstName: req.body.firstName,
        email: req.body.email
    };

    JoinToken.findOne({token: req.body.token}, (err, foundToken) => {
        if(err) return res.json({error: "Token is invalid"});

        if(!foundToken) return res.json({error: "Token is invalid"})

        if(Date.now() <= foundToken.tokenExpires && foundToken.email === userInfo.email) {
            User.register(new User(userInfo), req.body.password, (err) => {
                if(err) return res.json({error: err.message});
            
                passport.authenticate('local', (err, user, info) => {
                    if(err) return res.json({error: err});
                    if(!user) return res.json({error: info});
                    req.logIn(user, err => {
                        if(err) return res.json({error: err});
                        // Delete the token 
                        JoinToken.deleteOne({token: foundToken.token}).then(() => {
                            res.json({success: 'You are now logged in!'});
                            return
                        })
                    })
                })(req, res, next);
            });
        } else {
            return res.json({error: "Token is invalid or expired"})
        }
    })
});

// Handle login
app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) return res.json({error: err});
        if(!user) return res.json({error: info});
        req.logIn(user, err => {
            if(err) return res.json({error: err});
            res.json({success: 'You are now logged in!', userInfo: user});
            return
        })
    })(req, res, next);
})

app.get('/logged_in', (req, res) => {
    const userAuthenticated = req.isAuthenticated();

    return res.json({userAuthenticated: userAuthenticated, userInfo: req.user});
})

app.post('/logout', (req, res) => {
    req.logout();
    return res.json({success: 'User logged out'});
})

app.post('/createToken', middleware.isLoggedIn, (req, res) => {
    // Only specified user may add other users. 
    // Update in the future to store this list elsewhere
    if(req.user._id.toString() === '61e0b04b7eee8da38ef13f37') {
        crypto.randomBytes(20, (err, buf) => {
            const token = buf.toString('hex');
            if(err) return res.json({error: "Error generating token"});
    
            const joinToken = {
                token: token,
                tokenExpires: Date.now() + 3600000, // 1 hour
                email: req.body.email
            }
            JoinToken.create(joinToken, (err, token) => {
                if(err) return res.json({error: "Error generating token"});
    
                return res.json(token);
            })
        });
    } else {
        res.json({error: 'User not allowed to generate tokens.'})
    }
});


const root = require('path').join(__dirname, 'client', 'build')
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})

const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.info('Server is running...');
})