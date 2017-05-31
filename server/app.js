var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

const ensureLoggedIn = require('connect-ensure-login');
var auth = require("./auth");
// var upload = multer({ dest: DIR });

// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://valor-software.github.io');
//   res.setHeader('Access-Control-Allow-Methods', 'POST');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("dist/"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
// app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));


var homehtml = path.join(global.appRoot, 'dist', 'home.html');
console.log(homehtml);


const dbinstance = require("./database");
// console.log("dbinstance");
// console.log(dbinstance.db);



// Initialize Passport and restore authentication state, if any, from the
// session.

app.use(auth.initialize());
app.use(auth.session());

app.get('/', ensureLoggedIn.ensureLoggedIn('/login'), function(req, res, next) {
    next();
});

app.use("/api/v1", ensureLoggedIn.ensureLoggedIn('/login'), require("./api"));

app.get('/api/v1/*', function(req, res) {
    res.send('API Not found', 404);
});

app.get('/login',
    function(req, res) {
        res.render('login');
    });

app.post('/login',
    auth.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout',
    function(req, res) {
        req.logout();
        res.redirect('/');
    });
//

app.all('*', ensureLoggedIn.ensureLoggedIn('/login'), (req, res) => {
    console.log(`[TRACE] Server 404 request: ${req.originalUrl}`);
    res.status(200).sendFile(homehtml);
});


var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log('Working on port ' + PORT);
});