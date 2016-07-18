/**
 * Created by lihua on 2016/3/15.
 */

'use strict';

var express = require('express');
var fs = require('fs');
var compression = require('compression')
var async = require('./lib/asyncRequest');
var handlebars = require('express-handlebars')
    .create({'defaultLayout': 'main'});

var app = express();

//set view engine
app.engine('handlebars', handlebars.engine);//Express 模板引擎
app.set('view engine', 'handlebars');

//set http port
app.set('port', 3003);

app.use(compression());

app.use(require('body-parser')());
app.use(require('cookie-parser')());

//set static directory
app.use(express.static(__dirname + '/../public'));

//透传跨域请求
app.use('/api', async.cors);

require('./routes.js')(app);

// add support for auto views
var autoViews = {
    '/': 'task/list-task'
};
app.use(function(req,res,next){
    var path = req.path.toLowerCase();
    console.log("path=========="+path);
    // check cache; if it's there, render the view
    if(autoViews[path]){
        return res.render(autoViews[path]);
    }
    // if it's not in the cache, see if there's
    // a .handlebars file that matches
    if(fs.existsSync(__dirname + '/../views' + path + '.handlebars')){
        autoViews[path] = path.replace(/^\//, '');
        return res.render(autoViews[path], {});
    }
    // no view found; pass on to 404 handler
    next();
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
});