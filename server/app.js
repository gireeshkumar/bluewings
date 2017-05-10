var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

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

const dbinstance = require("./database");
// console.log("dbinstance");
// console.log(dbinstance.db);

app.use("/api/v1", require("./api"));

app.get('/api/v1/*', function(req, res) {
    res.send('API Not found', 404);
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res) {
    // redirect to home page
    res.redirect('/');
});



var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log('Working on port ' + PORT);
});