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

    var promises = [];

    var allslidestosave = req.body;
    var savedslides = [];

    for (var i = 0; i < allslidestosave.length; i++) {
        var dta = allslidestosave[i];
        var p = saveSlide(dta).then(data => savedslides.push(data));
        promises.push(p);
    }

    Promise.all(promises).then(values => {
        res.send(savedslides);
    });
});


function saveSlide(data) {

    console.log("*** Save Slide ***");
    console.log(data);

    var catkeys, domainkeys, tagkeys, slidekey;

    return new Promise(function(resolve, reject) {
        Promise.all([

            saveSlideCollection(data).then(key => {
                console.log('Save slide, success >>>> [' + data.filename + '] Key = ' + key);
                slidekey = key;
                return slidekey;
            }, err => console.log("error[SaveSlide]:" + err)),

            saveCollection('category', data.category).then(keys => {
                console.log('Save category, success');
                catkeys = keys;
            }, err => console.log("error[SaveCategory]:" + err)),

            saveCollection('domain', data.domain).then(keys => {
                console.log('Save domain, success');
                domainkeys = keys;
            }, err => console.log("error[SaveDomain]:" + err)),

            saveCollection('tags', data.tags).then(keys => {
                console.log('Save tags, success');
                tagkeys = keys;
            }, err => console.log("error[SaveTags]:" + err))


        ]).then(values => {
            console.log("All collection save completed");
            console.log(values);

            console.log("Link slide with category/tags/domain => slidekey == " + slidekey);

            var edges = [];
            var sldata = { name: "slide data" };

            console.log("Save Edge - Category" + catkeys);
            saveEdges({ value: 'Category -> Slide', from: 'category', to: 'slide' }, slidekey, catkeys);

            console.log("Save Edge - Domain" + domainkeys);
            saveEdges({ value: 'Edge -> Slide', from: 'domain', to: 'slide' }, slidekey, domainkeys);

            console.log("Save Edge - Tags" + tagkeys);
            saveEdges({ value: 'Tags -> Slide', from: 'tags', to: 'slide' }, slidekey, tagkeys);




            // res.send('Find collection [' + collectionname + '] by id[' + req.params.id + '] ');
            collection = dbinstance.collection('slides');

            var example = { "_key": slidekey + '' };


            collection.byExample(example).then(
                cursor => cursor.map(function(value) {
                    return value;
                })
            ).then(
                results => {
                    var record = results[0];
                    record._categories = catkeys;
                    record._tags = tagkeys;
                    record._domains = domainkeys;

                    collection.updateByExample(example, record).then(result => console.log(result));
                },
                err => console.error('Failed to fetch all documents:', err)
            );

            data.key = slidekey;
            resolve(data);
            // update slide instance with other references

        });
    });


}

function saveEdges(sldata, slidekey, keys) {
    //TODO not Promise, not waiting for the completion. Use Promise

    console.log('Save Edge called:[' + sldata + '] =>' + keys);

    if (keys === null || keys === undefined || keys.length === 0) {
        console.log('Save Edge called:[' + sldata + ']  SKIP ');
        return;
    }


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

function getTextAttr(array) {

    if (array === null || array === undefined || array.length === 0) {
        return '';
    }

    var txtattr = [];
    for (var i = 0; i < array.length; i++) {
        txtattr.push(array[i].text);
    }
    return txtattr.join(',');
}

function saveSlideCollection(data) {
    return new Promise(function(resolve, reject) {

        collection = dbinstance.collection("slides");

        const slideobj = { file: data.filename, originalname: data.originalname, desc: data.desc };
        slideobj.categories = getTextAttr(data.category);
        slideobj.tags = getTextAttr(data.tags);
        slideobj.domains = getTextAttr(data.domain);
        slideobj.searchcontent = slideobj.categories + ' ' + slideobj.tags + ' ' + slideobj.domains + ' ' + slideobj.desc;

        collection.save(slideobj).then(
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


    return new Promise(function(resolve, reject) {

        console.log('Save collection called:[' + name + '] =>' + data);

        if (data === null || data === undefined || data.length === 0) {
            console.log('Save collection called:[' + name + ']  SKIP ');
            resolve([]);
            return;
        }

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