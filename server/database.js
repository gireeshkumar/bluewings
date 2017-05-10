var arangojs = require('arangojs');

// Using a complex connection string with authentication
let host = '192.168.99.100'; //process.env.ARANGODB_HOST;
let port = 8529; //process.env.ARANGODB_PORT;
let database = 'bluewings'; //process.env.ARANGODB_DB;
let username = 'bluewings'; //process.env.ARANGODB_USERNAME;
let password = 'bluewings'; //process.env.ARANGODB_PASSWORD;





function initializeDB() {
    console.log("Initialize Database");
    console.log(`http://${username}:${password}@${host}:${port}`);

    let db = arangojs({
        url: `http://${username}:${password}@${host}:${port}`,
        databaseName: database
    });

    return db;
}
module.exports.db = new initializeDB();