const express = require('express'),
    router = express.Router(),
    path = require('path'),
    PDFDocument = require('pdfkit'),
    uuidV1 = require('uuid/v1'),
    fs = require('fs');

const DIR = './pdfgen/';

var pdffolder = path.join(global.appRoot, DIR);

const dbinstance = require("../database").db;

// // console.log("PDFDocument initialized");
// // console.log(PDFDocument);

// using key
function generatePDF4Conversation(user, convkey) {

    return new Promise(function(resolve, reject) {
        dbinstance.query(`FOR conv IN conversation   FILTER conv.createdby == '` + user._id + `' && conv._key == '` + convkey + `'
                        LET a = (FOR c in conv.slides 
                                    FOR a IN slides FILTER c.slide == a._key RETURN {"key":a._key, "file":a.file, "note":c.note, "index":c.index}) 
                        RETURN merge(conv, {slides:a})`)
            .then(
                cursor => cursor.map(function(value) {
                    return value;
                })
            ).then(
                results => {
                    generatePDF4ConversationObj(results.length > 0 ? results[0] : null)
                        .then(filepath => resolve(filepath), err => reject(err));
                },
                err => reject('Failed to fetch all documents:' + err)
            );

    });


}
//use object
function generatePDF4ConversationObj(convObj) {
    return new Promise(function(resolve, reject) {
        if (convObj != null && convObj != undefined) {
            pdffile = path.join(pdffolder, convObj.key + '_' + uuidV1() + '.pdf');
            console.log(pdffile);
            doc = new PDFDocument();
            stream = doc.pipe(fs.createWriteStream(pdffile));

            for (var i = 0; i < convObj.slides.length; i++) {
                var sld = convObj.slides[i];
                if (i != 0) {
                    doc.addPage();
                }
                addSlideToPDF(doc, sld);
            }

            doc.end();
            stream.on('finish', function() {
                console.log("PDF write completed");
                resolve(pdffile);
            });
            // return pdffile;
        } else {
            reject("null conversation object");
        }
    })
}

function addSlideToPDF(pdfdoc, slideinfo) {

    var imagefile = path.join(global.appRoot, 'uploads', slideinfo.file);
    console.log("imagefile:" + imagefile);

    // left, top
    doc.image(imagefile, 10, 50, { width: 580 })
        .fontSize(25).text('Slide ID :' + slideinfo.key, 10, 20);

    doc.fontSize(25).text('Notes', 50, 400)
        .fontSize(18)
        .moveDown()
        .text(slideinfo.note, {
            width: 500,
            align: 'justify',
            indent: 30,
            columns: 2,
            height: 300,
            ellipsis: true
        });
}


// generatePDF4Conversation('321751');

router.get('/', function(req, res) {
    console.log(dbinstance);
    res.send("Bluewings API Services - PDF Services = ");
})

// with conversation key
router.get('/:key', function(req, res) {
    console.log("Generate conversation PDF => " + req.params.key);
    generatePDF4Conversation(req.user, req.params.key)
        .then(
            pdffile => {
                res.download(pdffile, 'conversation_' + req.params.key + '.pdf');
            },
            err => res.status(500).send('Failed to fetch all documents:' + err)
        );

})

module.exports = router;