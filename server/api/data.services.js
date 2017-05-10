var express = require('express'),
    router = express.Router();

const dbinstance = require("../database").db;

router.get('/', function(req, res) {
    console.log(dbinstance.db);
    res.send("Bluewings API Services - Data Services = ");
})


router.get(['/domain', '/category', '/tags'], function(req, res) {

    let arr = req.url.split("/");
    let collectionname = arr[arr.length - 1];


    console.log("Collection => " + collectionname);

    collection = dbinstance.collection(collectionname);

    collection.all().then(
        cursor => cursor.map(function(value) {
            console.log(value);
            return { key: value._key, name: value.name };
        })
    ).then(
        results => res.send(results),
        err => console.error('Failed to fetch all documents:', err)
    );

});


router.get('/', function(req, res) {
    console.log(dbinstance);
    res.send("Bluewings API Services - Data Services = ");
})


module.exports = router