const express = require('express'),
      app = express(),
      session = require('express-session'),
      path = require('path'),
      MenuItem = require('./models/menuItem'),
      dotenv = require('dotenv').config(),
      mongoose = require('mongoose');


app.use(express.urlencoded({extended: true}));
// middleware for allowing react to fetch() from server
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, OPTIONS');
    next();
});

// CONNECT TO MONGODB
mongoose.connect(process.env.URI, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(session({
    cookie: { sameSite: "lax" },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    credentials: true
}));

app.get('/api/getMenu', (req, res) => {
   MenuItem.find((err, menu) => {
        if(err) return res.send("Error fetching menu");
        res.json(menu);
    })
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