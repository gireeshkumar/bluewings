var express = require('express'),
    router = express.Router()
extend = require('util')._extend;

const dbinstance = require("../database").db;

router.get('/', function(req, res) {
    console.log(dbinstance.db);
    res.send("Bluewings API Services - Data Services = ");
})

// 950
//http://192.168.99.100:3000/api/v1/data/slides/search?f=searchcontent&q=parnter
//
router.get('/search/:collection', function(req, res) {
    collectionname = req.params.collection;
    console.log("Query on collection -" + collectionname);
    console.log("Field::" + req.query.f);
    console.log("Query::" + req.query.q);

    collection = dbinstance.collection(collectionname);

    collection.fulltext(req.query.f, req.query.q).then(
        cursor => cursor.map(function(value) {
            return toCollectionObject(value);
        })
    ).then(
        results => res.send(results),
        err => console.error('Failed to fetch all documents:', err)
    );
});



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
router.get('/metadata', function(req, res) {

    var metadata = {};

    Promise.all([
        getCollectionAllData('category')
        .then(results => metadata.categories = results, err => res.status(500).send(err)),

        getCollectionAllData('domain')
        .then(results => metadata.domain = results, err => res.status(500).send(err)),

        getCollectionAllData('tags')
        .then(results => metadata.tags = results, err => res.status(500).send(err))
    ]).then(values => res.send(metadata));


});



router.get('/:collection/:id', function(req, res) {

    console.log("Call to => router.get('/:collection/:id')");

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
            results => res.send((results.length > 0 ? (results.length == 1 ? results[0] : results) : [])),
            err => console.error('Failed to fetch all documents:', err)
        );
    }

});
// TODO


router.get('/:collection', function(req, res) {
    collectionname = req.params.collection;
    if (['domain', 'category', 'tags', 'slides'].indexOf(collectionname) == -1) {
        res.send("Unknown collection - " + collectionname);
        return;
    }
    // let arr = req.url.split("/");
    // let collectionname = arr[arr.length - 1];

    // var fcount = (req.query.first === undefined ? -1 : parseInt(req.query.first)); // first count
    // var lcount = (req.query.last === undefined ? -1 : parseInt(req.query.last)); // get last n records

    // console.log("fcount => " + fcount + ' [>=0 ? ]' + (fcount >= 0));
    // console.log("lcount => " + lcount + ' [>=0 ? ]' + (lcount >= 0));


    console.log("Collection => " + collectionname);

    getCollectionAllData(collectionname).then(results => res.send(results), err => res.status(500).send(err));

    // collection = dbinstance.collection(collectionname);

    // collection.all()
    //     .then(
    //         cursor => cursor.map(function(value) {
    //             return toCollectionObject(value);
    //         })
    //     ).then(
    //         results => res.send(results),
    //         err => console.error('Failed to fetch all documents:', err)
    //     );

});


router.get('/', function(req, res) {
    console.log(dbinstance);
    res.send("Bluewings API Services - Data Services = ");
})






function getCollectionAllData(collectionname) {
    return new Promise(function(resolve, reject) {
        collection = dbinstance.collection(collectionname);
        collection.all()
            .then(
                cursor => cursor.map(function(value) {
                    return toCollectionObject(value);
                })
            ).then(
                results => resolve(results),
                err => reject('Failed to fetch all documents:', err)
            );
    });
}


module.exports = router