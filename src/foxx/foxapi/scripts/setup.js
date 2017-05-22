"use strict";

var db = require("@arangodb").db,
    slides = module.context.collectionName("slides");

if (db._collection(slides) === null) {
    db._create(slides);
}