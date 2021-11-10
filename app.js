const express = require('express'),
      app = express(),
      session = require('express-session'),
      path = require('path'),
      menu = require('./menuItems'),
      dotenv = require('dotenv').config();


app.use(express.urlencoded({extended: true}));
// Static for deployed app
app.use(express.static(path.join(__dirname, 'build')));
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

app.get('/*', function (req, res) {
    console.log(__dirname);
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.info('Server is running...');
})