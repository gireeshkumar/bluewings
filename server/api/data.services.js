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
router.get("/search/slides/q", function(req, res) {
    /*
    FOR i IN FULLTEXT(slides, "searchcontent", "edgeops")

    FOR cat IN category 
        FILTER cat.name == "design" 
        FILTER POSITION(i._categories, cat._key) == true // Join

    FOR tag IN tags 
        FILTER tag.name == "edgeops" // Filter by name
        FILTER POSITION(i._tags, tag._key) == true // Join

    FOR dmn IN domain // Then Loop on all categories
        FILTER dmn.name == "communication" || dmn.name == "healthcare" // Filter by name
        FILTER POSITION(i._domains, dmn._key) == true // Join


    RETURN i
    */


    var domains = req.query.d;
    var tags = req.query.t;
    var cats = req.query.c;
    var keywords = req.query.q;

    // building query

    var AQL = 'FOR i IN ' + ((keywords != null && keywords != undefined) ? 'FULLTEXT(slides, "searchcontent", "' + keywords + '")' : 'slides') +
        filterScript('_domains', domains, 'domain', 'dmn') +
        filterScript('_tags', tags, 'tags', 'tag') +
        filterScript('_categories', cats, 'category', 'cat') +
        ` 
    RETURN DISTINCT i`;


    console.log(AQL);

    // res.send(AQL);

    dbinstance.query(AQL)
        .then(
            cursor => cursor.map(function(value) {
                return toCollectionObject(value);
            })
        ).then(
            results => res.send(results),
            err => res.status(500).send('Failed to fetch all documents:' + err)
        );


});

function filterScript(fkkey, values, colname, colcode) {
    //TODO handle comma separated value  , OR condition

    // (tag.name == "tag3" || "d4h" || "v4g")

    var aql = '';


    if (values != null && values != undefined) {

        var arr = values.split(',');
        var vals = '';
        for (var i = 0; i < arr.length; i++) {
            if (i != 0) {
                vals += ' || ';
            }
            vals += '"' + arr[i] + '"';
        }

        aql = `
           FOR ` + colcode + ` IN ` + colname + `
         FILTER (` + colcode + `.name == ` + vals + `)
         FILTER POSITION(i.` + fkkey + `, ` + colcode + `._key) == true
        `
    }


    return aql;
}

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

//insert collection
router.post('/:collection', function(req, res) {

    collectionname = req.params.collection;
    record = req.body;
    console.log("Save ->" + collectionname);
    console.log(record);

    record.createdby = req.user._id;

    collection = dbinstance.collection(collectionname);
    collection.save(record).then(
        meta => {
            var example = { "_key": meta._key + '' };
            console.log("Find collection by example => " + collectionname);
            console.log(example);
            collection.byExample(example).then(
                cursor => cursor.map(function(value) {
                    return toCollectionObject(value);
                })
            ).then(
                results => res.send((results.length > 0 ? (results.length == 1 ? results[0] : results) : [])),
                err => res.status(500).send(err)
            );
        },
        err => res.status(500).send(err)
    );

})

router.post('/:collection/:id', function(req, res) {
    collectionname = req.params.collection;
    key = req.params.id;

    console.log("Update collection");
    console.log('Collection:[' + collectionname + ']{' + key + '}');
    console.log(req.body);

    collection = dbinstance.collection(collectionname);
    var example = { "_key": req.params.id + '' };

    if (collectionname === 'conversation') {
        // cleanup
        if (req.body.slides != null && req.body.slides != undefined) {
            for (var i = 0; i < req.body.slides.length; i++) {
                delete req.body.slides[i].file;
            }
        }
    }

    collection.byExample(example).then(
        cursor => cursor.map(function(value) {
            return value;
        })
    ).then(
        results => {
            console.log(results)
            if (results.length > 0) {
                var objectoupdate = results[0];

                //replace for conversation
                if (collectionname === 'conversation') {

                    if (req.body.merge !== undefined && req.body.merge) {
                        console.log("Merge conversation");
                        // objectoupdate = extend(objectoupdate, req.body);
                        // can only update notes filed now
                        objectoupdate.name = req.body.name;

                        if (req.body.slides != null && req.body.slides != undefined) {
                            for (var i = 0; i < req.body.slides.length; i++) {
                                var slidekey = req.body.slides[i].slide;
                                var idx = req.body.slides[i].index;
                                var nte = req.body.slides[i].note;

                                for (var j = 0; j < objectoupdate.slides.length; j++) {
                                    console.log("Match= " + objectoupdate.slides[j].slide + " === " + slidekey);
                                    if (objectoupdate.slides[j].slide === slidekey) {

                                        if (nte != null && nte != undefined) {
                                            objectoupdate.slides[j].note = nte;
                                        }
                                        if (idx != null && idx != undefined) {
                                            objectoupdate.slides[j].index = idx;
                                        }


                                        break;
                                    }
                                }
                            }
                        }


                    } else {
                        objectoupdate = req.body;
                    }
                } else {
                    objectoupdate = extend(objectoupdate, req.body);
                }

                console.log(objectoupdate);

                objectoupdate.updatedby = req.user._id;
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


router.delete('/:collection/:id', function(req, res) {

    console.log("Call to => router.get('/:collection/:id')");

    collectionname = req.params.collection;
    if (['domain', 'category', 'tags', 'slides', 'conversation'].indexOf(collectionname) == -1) {
        res.send("Unknown collection - " + collectionname);
    } else {

        //TODO check if the current user has permission to delete this record. (should be the creator)

        collection = dbinstance.collection(collectionname);
        collection.removeByKeys([req.params.id]).then(rslt => res.send(rslt), err => res.status(500).send(err));
    }
});


router.get('/:collection/:id', function(req, res) {

    console.log("Call to => router.get('/:collection/:id')");

    collectionname = req.params.collection;
    if (['domain', 'category', 'tags', 'slides', 'conversation'].indexOf(collectionname) == -1) {
        res.send("Unknown collection - " + collectionname);
    } else {
        // will let read all (created by all) domain/category/tags/slides etc, 
        // except for conversation
        if (collectionname === "conversation") {
            /*
        FOR conv IN conversation  FILTER conv._key == '321984'
 LET a = (FOR c in conv.slides 
            FOR a IN slides FILTER c.slide == a._key RETURN {"key":a._key, "file":a.file}) 
            
RETURN merge(conv, {slides:a})
        */

            dbinstance.query(`FOR conv IN conversation  FILTER conv.createdby == '` + req.user._id + `' && conv._key == '` + req.params.id + `'
                        LET a = (FOR c in conv.slides 
                                    FOR a IN slides FILTER c.slide == a._key RETURN {"key":a._key, "slide":a._key, "file":a.file, "note":c.note, "index":c.index}) 
                        RETURN merge(conv, {slides:a})`)
                .then(
                    cursor => cursor.map(function(value) {
                        return toCollectionObject(value);
                    })
                ).then(
                    results => res.send((results.length > 0 ? (results.length == 1 ? results[0] : results) : [])),
                    err => res.status(500).send('Failed to fetch all documents:' + err)
                );


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

    }

});
// TODO


router.get('/:collection', function(req, res) {
    collectionname = req.params.collection;
    if (['domain', 'category', 'tags', 'slides', 'conversation'].indexOf(collectionname) == -1) {
        res.send("Unknown collection - " + collectionname);
        return;
    }
    console.log("Collection => " + collectionname);

    /*
FOR conv IN conversation
 LET a = (FOR c in conv.slides 
            FOR a IN slides FILTER c.slide == a._key RETURN {"key":a._key, "file":a.file}) RETURN merge(conv, {slides:a})

    
    */
    if (collectionname === "conversation") {
        dbinstance.query(`FOR conv IN conversation   FILTER conv.createdby == '` + req.user._id + `' 
                             LET a = (FOR c in conv.slides 
                            FOR a IN slides FILTER c.slide == a._key RETURN {"key":a._key, "slide":a._key, "file":a.file, "note":c.note, "index":c.index}) 
                            RETURN merge(conv, {slides:a})`)
            .then(
                cursor => cursor.map(function(value) {
                    return toCollectionObject(value);
                })
            ).then(
                results => res.send(results),
                err => res.status(500).send('Failed to fetch all documents:' + err)
            );
    } else {
        getCollectionAllData(collectionname).then(results => res.send(results), err => res.status(500).send(err));
    }





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