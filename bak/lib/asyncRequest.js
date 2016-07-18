/**
 * Created by lihua on 2016/3/15.
 */

'use strict';

var request = require('request');
var config = require('../config');

function getUrl(req){
    var url = req.originalUrl.replace(req.baseUrl, '');
    var index = url.indexOf('/', 1);
    var baseUrl = url.slice(1, index);
    if(config.server[baseUrl]){
        return url.replace('/' + baseUrl, config.server[baseUrl]);
    }
    return '';
}

function getToken(req){
    var token = req.params.access_token || req.cookies.access_token || '';
    return decodeURIComponent(token);
}

exports.request = function(req, res, opts, callback){
    var token = getToken(req);
    if(!token){
        return res.render('refresh-token');
    }
    opts.qs = {
        'access_token': token
    };
    request(opts, function(err, response, body){
        //检测token是否合法，如果不合法则转到刷新token界面
        if(response && response.statusCode === 401 && response.statusMessage === 'Unauthorized'){
            if(typeof response.body === 'string' && response.body.indexOf('invalid_token') > -1 ||
                typeof response.body === 'string' && response.body.error && response.body.error === 'invalid_token'){
                return res.render('refresh-token');
            }
        }
        callback && callback.apply(this, arguments);
    });
};

exports.cors = function(req, res, next){
    var url = getUrl(req);
    if(url){
        var opts = {
            url: url,
            method: req.method,
            headers: req.headers
        };
        if(req.method !== 'GET' && req.body && Object.keys(req.body).length){
            if(req.headers['content-type'] === 'application/json'){
                opts.json = true;
                opts.body = req.body;
            }
        }
        request(opts, function(error, response, body){
            if (error) {
                return res.json({'error':'server error','error_description': error});
            }
            /*if(response && response.statusCode === 401 && response.statusMessage === 'Unauthorized'){
                if(typeof response.body === 'string' && response.body.indexOf('invalid_token') > -1 ||
                    typeof response.body === 'object' && response.body.error && response.body.error === 'invalid_token'){
                    res.set(response.headers);
                    return res.send(body);
                }
            }*/
            res.status(response.statusCode);
            res.set(response.headers);
            return res.send(body);
        });
        return;
    }
    next();
};