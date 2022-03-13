const express = require('express'),
      app = express(),
      session = require('express-session'),
      MemoryStore = require('memorystore')(session),
      cors = require('cors'),
      cookieParser = require('cookie-parser'),
      path = require('path'),
      fs = require('fs'),
      passport = require('passport'),
      MenuItem = require('./models/menuItem'),
      User = require('./models/user.js'),
      Category = require('./models/category'),
      JoinToken = require('./models/joinToken'),
      Hours = require('./models/hours'),
      middleware = require('./middleware'),
      dotenv = require('dotenv').config(),
      mongoose = require('mongoose'),
      crypto = require('crypto'),
      PDFDocument = require('pdfkit'),
      nodemailer = require('nodemailer'),
      { google } = require('googleapis'),
      async = require('async');

const { file } = require('googleapis/build/src/apis/file');
const allowedOrigins = require('./allowedOrigins');

// CONFIGURE GOOGLE
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});

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
    origin: function (origin, callback) {
    // bypass the requests with no origin (like curl requests, mobile apps, etc )
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
    }
    return callback(null, true);
    },
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
            Hours.find((err, hours) => {
                if(err) return res.json({menu: {error: 'Error fetching hours'}});
        
                return res.json({menu: menu, categories: categories, text: hours[0].text, id: hours[0]._id});
            })
        })
    })
});

app.get('/api/menu/pdf', (req, res) => {
    MenuItem.find((err, menu) => {
        if(err) return res.json({menu: {error: 'Error fetching menu'}});
        Category.find((err, categories) => {
            if(err) return res.json({menu: {error: 'Error fetching categories'}});
            
            // Initialize pdf
            const doc = new PDFDocument;
            const writeStream = fs.createWriteStream('./menu.pdf');
            doc.pipe(writeStream); // write to PDF

            doc.font('Helvetica-Bold', {continued: true})
               .fontSize(24, {continued: true})
               .text('Burger Barn', {align: 'center'})
               .fontSize(12)
               .font('Helvetica');
            
            doc.text('Call 802-730-3441 to order',{align: 'center'});
            doc.text('***CASH ONLY***', {align: 'center'});

            doc.moveDown();

            for(let cat of categories) {
                // Category
                doc.font('Helvetica-Bold', {continued: true})
                   .fontSize(18, {continued: true})
                   .text(cat.displayName)
                   .fontSize(12)
                   .font('Helvetica');

                // Menu items within the category
                const sortedMenu = menu.filter(item => item.category === cat.name)
                    .sort((a,b) => {return a.order - b.order});
                    
                for(let item of sortedMenu) {
                    let priceStr = [];
                    doc.font('Helvetica-Bold', {continued: true})
                       .text(item.name)
                       .fontSize(12)
                       .font('Helvetica');
                    doc.text(item.description);
                    item.prices.map((price, ind) => {
                        if(price[0] || price[1]) {
                            priceStr.push(price[0] ? price[0]+' '+price[1] : price[1])
                        }
                        })
                        doc.text(priceStr.join(', '));
                    doc.moveDown();
                }
            }

            // finalize the PDF and end the stream
            doc.end();

            writeStream.on('finish', function () {
                // send the PDF file
                res.sendFile(`${__dirname}/menu.pdf`);
            });
        })
    })
})

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

//// Edit Hours/Announcements field
app.post('/api/hours/:id', middleware.isLoggedIn, (req, res) => {
    Hours.findByIdAndUpdate(req.params.id, {text: req.body.text}, (err, updatedHours) => {
        if(err) return res.json({error: 'Error updating hours'});
    
        return res.json({success: 'Hours successfully updated'});
    })
});

//// Get Hours/Announcements field
app.get('/api/hours', (req, res) => {
    Hours.find((err, hours) => {
        if(err) return res.json({menu: {error: 'Error fetching hours'}});

        return res.json({text: hours[0].text, id: hours[0]._id});
    })
});

// Add hours (only used to initialize hours)
//app.post('/api/hours', middleware.isLoggedIn, (req, res) => {
//    Hours.create({text: req.body.text}, (err, newHours) => {
//        if(err) return res.json({error: 'Error creating item'});
//        
//        res.json({success: 'New item created'});
//    })
//});

// Handle registration logic
// TOKEN REQUIRED TO REGISTER
app.post('/register', (req, res, next) => {
    const userInfo = {
        firstName: req.body.firstName,
        email: req.body.email
    };

    // Protect registration route with a token generated by an administrator
    // Comment out logic to test
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
    // End comment out logic to test
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
    if(req.user._id.toString() === process.env.ADMIN_USER_ID) {
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

// Send email to reset password
app.post('/forgot', (req, res, next) => {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, (err, buf) => {
                const token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({email: req.body.email}, (err, user) => { 
                if(!user) {
                    return res.json({error: 'No account associated with that email exists'});
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(err => {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            // Get access token
            const accessToken = oAuth2Client.getAccessToken();

            const smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'nicholaseveland93@gmail.com',
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET,
                    refreshToken: process.env.REFRESH_TOKEN,
                    accessToken: accessToken
                }
            });
            const mailOptions = {
                to: user.email,
                from: '"Burger Barn" <cnicholaseveland93@gmail.com>',
                subject: 'Burger Barn Password Reset',
                text: `Hi, \n\n Someone requested that the password for your Burger Barn account be reset. \n\n Please click the following link or copy and paste it into your browser to reset your password. https://${process.env.FRONT_END_URL}/reset/${token} \n\n If you did not request this, you can ignore this email or let us know. Your password won't change until you create a new password. \n\n Sincerely, \n Burger Barn`,
                html: `
                <h3>Hi,</h3>

                <p>Someone requested that the password for your Burger Barn account be reset. Please click button below or copy and paste the link into your browser to reset your password.</p>
                
                <button style="background: #3492eb; border-color: #3492eb; border-radius: 5px;"><a href="https://${process.env.FRONT_END_URL}/reset/${token}" style="color: black; text-decoration: none;">Reset Password</a></button>

                <p>If you did not request this, you can ignore this email or let us know. Your password won't change until you create a new password.</p>
                <p>Sincerely,</p> 
                <p>Burger Barn</p>`
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                if(err) {
                    return done(err, 'done');
                }
                res.json({success: 'Password reset request sent'});
                done(err, 'done');
            });
        }
    ], function(err) {
        if(err) {
            return next(err);
        }
    });
});

// Send reset password token
app.get('/reset/:token', (req, res) => {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function(err, user) {
        if(!user) {
            return res.json({error: 'Password reset token is invalid or has expired'});
        }
        return res.json({token: req.params.token});
    })
});

// Reset password
app.post('/reset/:token', (req, res) => {
    async.waterfall([
        function(done) {
            User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err, user) => {
                if(!user) {
                    return res.json({error: 'Password reset token is invalid or has expired'});
                }
                if(req.body.password === req.body.confirmPassword) {
                    user.setPassword(req.body.password, (err) => {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save((err) => {
                            req.logIn(user, (err) => {
                                done(err, user);
                            });
                        });
                    })
                } else {
                    return res.json({error: 'Passwords do not match'});
                }
            });
        },
        function(user, done) {
            // Get access token
            const accessToken = oAuth2Client.getAccessToken();

            const smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'nicholaseveland93@gmail.com',
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET,
                    refreshToken: process.env.REFRESH_TOKEN,
                    accessToken: accessToken
                }
            });
            const mailOptions = {
                to: user.email,
                from: '"Burger Barn" <nicholaseveland93@gmail.com>',
                subject: 'Your password has been changed',
                text: `Hi, \n\n Your Burger Barn password has just changed.`
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                if(err) {
                    return res.json({error: 'Something went wrong, try again'});
                }
                return res.json({success: 'Success! Your password has been changed.'});
            })
        }
    ], function(err) {
        if(err) {
            return res.json({success: 'Success! Your password has been changed.'});
        }
        return res.json({success: 'Success! Your password has been changed.'});
    })
});

const root = path.join(__dirname, 'client', 'build')
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})

const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.info('Server is running...');
})