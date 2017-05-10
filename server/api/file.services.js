const express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    fs = require('fs'),
    path = require('path');

const DIR = './uploads/';
const FILE_STORAGE = './storage/';

const dbinstance = require("../database").db;
// var upload = multer({ dest: DIR });


router.get('/', function(req, res) {
    console.log(dbinstance);
    res.send("Bluewings API Services - File Services = ");
})

var upload = multer({
    dest: DIR,
    rename: function(fieldname, filename) {
        return filename + Date.now();
    },
    onFileUploadStart: function(file) {
        console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function(file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
    }
});

router.get('/view/:filename', function(req, res) {
    // console.log(__dirname);
    // console.log(global.appRoot);
    var file = path.join(global.appRoot, DIR, req.params.filename);
    console.log("Read file:" + file);
    res.sendFile(file);
});

router.post('/api', upload.array('file'), function(req, res) {
    var file = req.files[0];
    res.send({ filename: file.filename, originalname: file.originalname });
});

router.post('/save', function(req, res) { //bodyParser.json(),
    console.log(req.body);

    for (var i = 0; i < req.body.length; i++) {
        var dta = req.body[i];
        saveSlide(dta);
    }


    res.send({});
});


function saveSlide(data) {

    console.log("*** Save Slide ***");
    console.log(data);

    var catkeys, domainkeys, tagkeys, slidekey;

    Promise.all([

        saveCollection('category', data.category).then(keys => {
            console.log('Save category, success');
            catkeys = keys;
        }, err => console.log("error:" + err)),

        saveCollection('domain', data.domain).then(keys => {
            console.log('Save domain, success');
            domainkeys = keys;
        }, err => console.log("error:" + err)),

        saveCollection('tags', data.tags).then(keys => {
            console.log('Save tags, success');
            tagkeys = keys;
        }, err => console.log("error:" + err)),

        saveSlideCollection(data).then(key => {
            console.log('Save slide, success >>>> ');
            slidekey = key;
        }, err => console.log("error:" + err))

    ]).then(values => {
        console.log("All collection save completed");
        console.log(values);

        console.log("Link slide with category/tags/domain");

        var edges = [];
        var sldata = { name: "slide data" };

        console.log("Save Edge - Category" + catkeys);
        saveEdges({ value: 'Category -> Slide', from: 'category', to: 'slide' }, slidekey, catkeys);

        console.log("Save Edge - Domain" + domainkeys);
        saveEdges({ value: 'Edge -> Slide', from: 'domain', to: 'slide' }, slidekey, domainkeys);

        console.log("Save Edge - Tags" + tagkeys);
        saveEdges({ value: 'Tags -> Slide', from: 'tags', to: 'slide' }, slidekey, tagkeys);

        // edges = edges.concat(toEdge(slidekey, catkeys));
        // edges = edges.concat(toEdge(slidekey, domainkeys));
        // edges = edges.concat(toEdge(slidekey, tagkeys));

    });
}

function saveEdges(sldata, slidekey, keys) {
    //TODO not Promise, not waiting for the completion. Use Promise

    collection = dbinstance.edgeCollection('has-slides');

    if (keys != null && keys.length > 0) {
        for (var i = 0; i < keys.length; i++) {

            if (keys[i] === undefined) {
                continue;
            }

            //save (data, fromId, toId
            console.log('Save Edge - [' + keys[i] + ' => ' + slidekey + ']');
            collection.save(sldata, keys[i], slidekey).then(
                meta => {
                    console.log("Edge Saved");
                    console.log(meta);
                },
                err => console.error('Failed to save Edge:', err)
            );

        }
    }
}

function saveSlideCollection(data) {
    return new Promise(function(resolve, reject) {

        collection = dbinstance.collection("slides");
        collection.save({ file: data.filename, originalname: data.originalname, desc: 'some description here' }).then(
            meta => {
                console.log("Slide save success");
                console.log(meta);
                resolve(meta._key);
            },
            err => console.error('Failed to save document:', err)
        );
    });
}

function saveCollection(name, data) {
    console.log('Save collection called:[' + name + ']')

    return new Promise(function(resolve, reject) {

        // if 'id' doesnt exist, insert
        var ids = [];
        var tosave = [];

        for (var i = 0; i < data.length; i++) {
            var did = data[i].id;

            // if (did === null || did === undefined) {
            //     tosave.push({ name: data[i].text });
            // } else {
            //     ids.push(did);
            // }

            if (did === null || did === undefined) {
                tosave.push({ name: data[i].text });
            } else {
                ids.push(did);
                tosave.push({ _key: data[i].id, name: data[i].text });
            }

        }

        console.log("To Save - " + name);
        console.log(tosave);

        if (tosave.length > 0) {
            // push unsaved items to DB

            collection = dbinstance.collection(name);
            collection.save(tosave).then(
                meta => {
                    keys = meta.map(function(a) { return a._key; });
                    console.log('Collection[' + name + '] saved: ');
                    console.log(keys);
                    // merge with existing keys and return
                    resolve(ids.concat(keys));
                },
                err => console.error('Failed to save document:', err)
            );
        } else {
            resolve(ids);
        }

        //TODO handle error


    });
}


module.exports = router