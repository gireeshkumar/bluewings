var express = require('express'),
    router = express.Router()
extend = require('util')._extend;

const dbinstance = require("../database").db;

router.get('/', function(req, res) {
    console.log(dbinstance.db);
    res.send("Bluewings API Services - Data Services = ");
})


/*
       "_key": "183635",
       "_id": "slides/183635",
       "_rev": "_V_Vzzs2---",
       */

function toCollectionObject(value) {
    value.key = value._key;

    delete value._key;
    delete value._id;
    delete value._rev;

    return value;
}

router.post('/:collection/:id', function(req, res) {
    collectionname = req.params.collection;
    key = req.params.id;

    console.log("Update collection");
    console.log('Collection:[' + collectionname + ']{' + key + '}');
    console.log(req.body);

    collection = dbinstance.collection(collectionname);
    var example = { "_key": req.params.id + '' };

    collection.byExample(example).then(
        cursor => cursor.map(function(value) {
            return value;
        })
    ).then(
        results => {
            console.log(results)
            if (results.length > 0) {
                var objectoupdate = results[0];

                var objectoupdate = extend(objectoupdate, req.body);

                console.log(objectoupdate);

                collection.updateByExample(example, objectoupdate).then(result => res.send(result));

            } else {
                res.end("nothing to update");
            }

        },
        err => console.error('Failed to fetch all documents:', err)
    );
});

router.get('/:collection/:id', function(req, res) {
    collectionname = req.params.collection;
    if (['domain', 'category', 'tags', 'slides'].indexOf(collectionname) == -1) {
        res.send("Unknown collection - " + collectionname);
    } else {
        // res.send('Find collection [' + collectionname + '] by id[' + req.params.id + '] ');

        collection = dbinstance.collection(collectionname);

        var example = { "_key": req.params.id + '' };

        collection.byExample(example).then(
            cursor => cursor.map(function(value) {
                return toCollectionObject(value);
            })
        ).then(
            results => res.send((results.length > 0 ? (results.length == 1 ? results[0] : results) : null)),
            err => console.error('Failed to fetch all documents:', err)
        );
    }

});

router.get(['/domain', '/category', '/tags', '/slides'], function(req, res) {

    let arr = req.url.split("/");
    let collectionname = arr[arr.length - 1];


    console.log("Collection => " + collectionname);

    collection = dbinstance.collection(collectionname);

    collection.all().then(
        cursor => cursor.map(function(value) {
            return toCollectionObject(value);
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