var path = require('path');
console.log(path.resolve(__dirname));
global.appRoot = path.resolve(__dirname);

require("./server/app");