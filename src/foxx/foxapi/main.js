(function() {
    "use strict";

    const _ = require('lodash');
    const createRouter = require('@arangodb/foxx/router');
    const router = createRouter();
    module.context.use(router);

    const slides = module.context.collection('slides');

    var db = require("@arangodb").db

    /** Lists of all Todos
     *
     * This function simply returns the list of all todos.
     */

    router.get('/slides', function(req, res) {
        var array = db._query('FOR document IN slides RETURN document').toArray();
        res.json(_.map(array, function(slide) {
            return _.omit(slide, ['_rev', '_id', '_oldRev']);
        }));
    });


}());