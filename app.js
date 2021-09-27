const express = require('express'),
      app = express(),
      ejs = require('ejs'),
      path = require('path'),
      menu = require('./menuItems');


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,"client")));
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({extended: true}));

// routes
app.get('/admin', (req, res) => {
    res.render('admin/index.ejs');
})

app.get('/', (req, res) => {
    res.render('index',{menu});
})

app.get('*', (req, res) => {
    res.redirect('/');
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.info('Server is running...');
})