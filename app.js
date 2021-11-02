const express = require('express'),
      app = express(),
      session = require('express-session'),
      path = require('path'),
      menu = require('./menuItems'),
      dotenv = require('dotenv').config();


app.use(express.urlencoded({extended: true}));
// middleware for allowing react to fetch() from server
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, OPTIONS');
    next();
});

app.use(session({
    cookie: { sameSite: "lax" },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    credentials: true
}));

// routes
app.get('/api/getMenu', (req, res) => {
    res.json(menu);
});

//production mode
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '/client/build', 'index.html'));  
    })
}

app.get('*', (req, res) => {
    res.redirect('/');
})

const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.info('Server is running...');
})