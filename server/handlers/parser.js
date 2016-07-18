/**
 * Created by lihua on 2016/3/17.
 */

'use strict';

var asyncRequest = require('../lib/asyncRequest');

exports.editParser = function(req, res){

    var url = decodeURIComponent(req.query.url);
    console.log("url======================"+url);

    asyncRequest.request(req, res, {
        url: url
    } , function(error, response, body){
        res.render('parser/edit-parser', {code: body});
    });
};