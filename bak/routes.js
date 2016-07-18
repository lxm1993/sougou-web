'use strict';

var parser = require('./handlers/parser');

module.exports = function(app){
    app.get('/parser/edit-parser', parser.editParser);
};