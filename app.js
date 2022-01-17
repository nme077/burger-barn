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
      dotenv = require('dotenv').config(),
      mongoose = require('mongoose');

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
    resave: false,
    saveUninitialized: false,
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
app.post('/api/menu', (req, res) => {
    //name: String,
    //category: String,
    //prices: [[String]],
    //description: String,
    //order: Number
    
    const newItem = {
        name: req.body.name,
        category: req.body.category,
        prices: [[req.body.priceDesc1, req.body.price1], [req.body.priceDesc2, req.body.price2]],
        description: req.body.description,
        order: req.body.order
    }
    MenuItem.create(newItem, (err, itemCreated) => {
        if(err) return res.json({error: 'Error creating item'});
    
        res.json({success: 'New item created'});
    })
});

// Save changes to menu item
app.post('/api/menu/edit/:id', (req, res) => {
    const item = {
        name: req.body.name,
        category: req.body.category,
        prices: [[req.body.priceDesc1, req.body.price1], [req.body.priceDesc2, req.body.price2]],
        description: req.body.description,
        order: req.body.order
    }
    MenuItem.findByIdAndUpdate(req.params.id, item, (err, itemUpdated) => {
        if(err) return res.json({error: 'Error creating item'});
    
        return res.json({success: 'Item successfully updated'});
    })
});

// Delete menu item
app.post('/api/menu/:id', (req, res) => {
    MenuItem.findByIdAndDelete(req.params.id, err => {
        if(err) return res.json({error: 'Error deleting item'});

        return res.json({success: 'Item successfully updated'});
    })
});

// Add category
app.post('/api/menu/category', (req, res) => {

});

// Edit category
app.put('/api/menu/category/:id', (req, res) => {
    
});

// Delete category
app.delete('/api/menu/category/:id', (req, res) => {
    
});

// Handle registration logic
// UPDATE THIS TO REQUIRE A TOKEN TO REGISTER
app.post('/register', (req, res) => {
    const userInfo = {
        firstName: req.body.firstName,
        email: req.body.email
    };

    User.register(new User(userInfo), req.body.password, (err) => {
        if(err) return res.json({error: err.message});
    
        passport.authenticate('local')(req, res, () => {
            return res.json({success: `Welcome, ${req.user.email}!`});
        });
    });
});

// Handle login
app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user) {
      if (err) return next(err);
      if (!user) return res.json({error: 'try again?'});

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.json({success: 'Welcome!!!', user});
      });
    })(req, res, next);
}); 

app.get('/logged_in', (req, res) => {
    return res.json({message: req.isAuthenticated()});
})


const root = require('path').join(__dirname, 'client', 'build')
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})

const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.info('Server is running...');
})