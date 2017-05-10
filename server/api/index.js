var express = require('express'),
    router = express.Router();



router.get('/', function(req, res) {
    res.send("Bluewings API Services");
})


router.use("/file", require("./file.services"));
router.use("/data", require("./data.services"));

module.exports = router