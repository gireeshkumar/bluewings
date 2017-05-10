// or plain old Node-style
var arangojs = require('arangojs');
// var db1 = arangojs();
// var db2 = new arangojs.Database();

// db.useBasicAuth(username, password);

// console.log(db2);


// Using a complex connection string with authentication
let host = '192.168.99.100'; //process.env.ARANGODB_HOST;
let port = 8529; //process.env.ARANGODB_PORT;
let database = 'bluewings'; //process.env.ARANGODB_DB;
let username = 'bluewings'; //process.env.ARANGODB_USERNAME;
let password = 'bluewings'; //process.env.ARANGODB_PASSWORD;

console.log(`http://${username}:${password}@${host}:${port}`);

let db = arangojs({
    url: `http://${username}:${password}@${host}:${port}`,
    databaseName: database
});

// db.listCollections().then(collections => {
//     // collections is an array of collection descriptions
//     // not including system collections
//     console.log(collections);
// });


// collection.save(doc).then(
//   meta => console.log('Document saved:', meta._rev),
//   err => console.error('Failed to save document:', err)
// );


collection = db.collection('firstCollection');

console.log(collection);

collection.get(function(err) {
    console.log("Error in getting collection '" + err);
});


collection = db.collection('tags');
collection.get()
    .then(data => {
        console.log("About collection");
        console.log(data);
    }, err => console.error('Error in getting collection - category' + err));

// doc = {
//     a: 'foo',
//     b: 'bar',
//     c: Date()
// };

collection.save([{ name: 'tag1' }, { name: 'tag2' }, { name: 'tag3' }]).then(
    meta => {
        console.log('Document saved:', meta);
        console.log("Keys");
        console.log(meta.map(function(a) { return a._key; }))
    },
    err => console.error('Failed to save document:', err)
);

// collection.all().then(data => {
//     console.log("All domain:");
//     console.log(data)
// }, err => {
//     console.log("Error in loading data")
// });