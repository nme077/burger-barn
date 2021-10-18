const express = require('express'),
      app = express(),
      ejs = require('ejs'),
      path = require('path'),
      menu = require('./menuItems');


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,"public")));
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({extended: true}));
// middleware for allowing react to fetch() from server
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, OPTIONS');
    next();
});

// routes
app.get('/api/getMenu', (req, res) => {
    res.json(menu);
});

app.get('/admin', (req, res) => {
    res.render('admin/index.ejs',{menu});
})

app.get('/', (req, res) => {
    res.render('index',{menu});
})

app.get('*', (req, res) => {
    res.redirect('/');
})

const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.info('Server is running...');
})