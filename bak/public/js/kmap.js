/**
 * Created by lihua on 2015/12/22.
 */

'use strict';

define(['jquery', 'jso', 'underscore'], function($, JSO, _){
    var config = {
        // dataServer: 'http://10.134.14.117:8080',
        // taskServer: 'http://10.134.14.117:8080',
        // authorizationServer: 'http://10.134.14.117:8080',
        dataServer: '/api/data',
        taskServer: '/api/task',
        authorizationServer: '/api/authorization',
        authorizationJso: 'http://10.134.14.117:8080'
    };
    var jso = new JSO({
        providerID: 'knowledge-task',
        client_id: 'web',
        redirect_uri: window.location.href,
        authorization: config.authorizationJso + '/passport/oauth/authorize'
    });
    var gToken, gUser;

    jso.callback();
    jso.getToken(function(token) {
        gToken = token.access_token;
        gUser = token.user;
    }, {});

    var ajax = function(opts){
        var errorCallback = opts.error;
        var successCallback = opts.success;
        jso.getToken(function(token){
            if(token && token.access_token){
                gToken = token.access_token;
                opts.beforeSend = function(xhr){
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token.access_token);
                };
                /*opts.headers = opts.headers || {};
                 opts.headers.Authorization = 'Bearer ' + token.access_token;*/
                /*if(typeof opts.data == 'object'){
                    opts.data.access_token = token.access_token;
                }*/
                if(opts.url.indexOf('?') > -1){
                    opts.url += '&access_token=' + token.access_token;
                }else{
                    opts.url += '?access_token=' + token.access_token;
                }
                opts.error = function(a){
                    if(a.status === 403 && a.statusText === 'Forbidden'){
                        /*alert('没有权限，请切换用户登录。');
                        return $('#logout-link').click();*/
                    } else if(a.status === 401 && a.statusText === 'Unauthorized'){
                        wipeTokens();
                        location.reload();
                    }
                    errorCallback.apply(this, arguments);
                };
                opts.success = function(data){
                    successCallback && successCallback.apply(this, arguments);
                };
                $.ajax(opts);
            }else{
                jso && jso.wipeTokens();
                location.reload();
            }
        },{});
    };

    /**
     * 查询url中的参数
     * @param name
     * @returns {*}
     */
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) {
            return r[2];
        }
        return null;
    }

    /**
     * 存取列表中的数据
     * KmapStorage.local.set(table, key, data, maxLen);
     * KmapStorage.local.setLst(table, key, list, maxLen);
     * KmapStorage.local.get(table, key, value);
     * KmapStorage.local.remove(table, key, value);
     *
     * 存取单个值
     * KmapStorage.local.setValue(key, value);
     * KmapStorage.local.getValue(key);
     */
    var kmapStorage = (function(){
        var storage = {};
        if(localStorage){
            storage.local = storageFactory(localStorage);
        }
        if(sessionStorage){
            storage.session = storageFactory(sessionStorage);
        }
        return storage;

        function storageFactory(storage){
            if(!storage){
                return false;
            }
            var setCollect = function(table, key, data, maxLen){
                if(typeof data[key] === 'undefined'){
                    return;
                }
                var list = storage.getItem(table);
                if(!list){
                    list = [data];
                }else{
                    list = JSON.parse(list);
                    for(var i = 0; i < list.length; i++){
                        if(list[i][key] === data[key]){
                            list.splice(i, 1);
                            break;
                        }
                    }
                    list.unshift(data);
                }
                if(maxLen && list.length > maxLen){
                    list = list.slice(0, maxLen);
                }
                storage.setItem(table, JSON.stringify(list));
                return true;
            };
            var setCollectList = function(table, key, list, maxLen){
                if(list instanceof  Array){
                    for(var i = 0; i < list.length; i++){
                        setCollect(table, key, list[i], maxLen);
                    }
                }
            };
            var getCollect = function(table, key, value){
                var list = storage.getItem(table);
                if(list){
                    list = JSON.parse(list);
                    if(typeof key === 'undefined'){
                        return list;
                    }
                    for(var i = 0; i < list.length; i++){
                        if(list[i][key] === value){
                            return list[i];
                        }
                    }
                }
                return '';
            };
            var removeCollect = function(table, key, value){
                if(typeof key === 'undefined'){
                    storage.removeItem(table);
                    return true;
                }
                var list = storage.getItem(table);
                if(list){
                    list = JSON.parse(list);
                    for(var i = 0; i < list.length; i++){
                        if(list[i][key] === value){
                            list.splice(i, 1);
                            if(list.length === 0){
                                storage.removeItem(table);
                            }else{
                                storage.setItem(table, JSON.stringify(list));
                            }
                            return true;
                        }
                    }
                }
                return false;
            };
            var setValue = function(key, value){
                if(typeof key === 'string' && typeof value !== 'undefined'){
                    storage.setItem(key, JSON.stringify(value));
                    return true;
                }
                return false;
            };
            var getValue = function(key){
                var value = storage.getItem(key);
                try{
                    return JSON.parse(value);
                }catch(e){
                    return value;
                }
            };

            return {
                get:getCollect,
                set:setCollect,
                setList: setCollectList,
                remove:removeCollect,
                getValue: getValue,
                setValue: setValue
            };
        }
    }());

    var cookieUtils = (function(){
        //取得cookie
        function getCookie(name) {
            var nameEQ = name + '=';
            var ca = document.cookie.split(';');    //把cookie分割成组
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];                      //取得字符串
                while (c.charAt(0) === ' ') {          //判断一下字符串有没有前导空格
                    c = c.substring(1,c.length);      //有的话，从第二位开始取
                }
                if (c.indexOf(nameEQ) === 0) {       //如果含有我们要的name
                    return decodeURIComponent(c.substring(nameEQ.length,c.length));    //解码并截取我们要值
                }
            }
            return false;
        }

        //清除cookie
        function clearCookie(name) {
            setCookie(name, '', -1);
        }

        //设置cookie
        function setCookie(name, value, seconds) {
            seconds = seconds || 0;   //seconds有值就直接赋值，没有为0，这个根php不一样。
            var expires = '';
            if (seconds !== 0 ) {      //设置cookie生存时间
                var date = new Date();
                date.setTime(date.getTime()+(seconds*1000));
                expires = '; expires='+date.toGMTString();
            }
            document.cookie = name+'='+encodeURIComponent(value)+expires+'; path=/';   //转码并赋值
        }

        return {
            'set': setCookie,
            'get': getCookie,
            'delete': clearCookie
        };
    }());

    var dateFormate = function (date, fmt) { //author: meizz
        if(!date){
            return '';
        }
        fmt = fmt || 'yyyy-MM-dd';
        var o = {
            'M+': date.getMonth() + 1, //月份
            'd+': date.getDate(), //日
            'h+': date.getHours(), //小时
            'm+': date.getMinutes(), //分
            's+': date.getSeconds(), //秒
            'q+': Math.floor((date.getMonth() + 3) / 3), //季度
            'S': date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in o){
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }
        return fmt;
    };

    var buildMenu = function (curMenu){
        $('#logout-link').click(function(){
            wipeTokens();
            $.ajax({
                url: config.authorizationJso + '/passport/oauth/users/' + gUser + '/tokens/' + gToken + '?access_token=' + gToken,
                type: 'DELETE',
                cache: false,
                success: function(){
                    console.log('delete token success!');
                },
                error: function(){
                    console.log('delete token error!');
                }
            });
            $.ajax({
                url: config.authorizationJso + '/passport/oauth/end_session',
                type: 'GET',
                cache: false,
                timeout:500,
                xhrFields: {
                    withCredentials: true
                },
                complete: function(){
                    location.reload();
                }
            });
        });
        $('#menu-username').text(gUser);
        $('#menu-navbar .' + curMenu).closest('li').addClass('active');
    };


    var getToken = function(){
        return gToken;
    };
    
    var refreshToken = function(){
        jso && jso.wipeTokens();
        jso.getToken();
    };

    var wipeTokens = function(){
        jso && jso.wipeTokens();
    };

    return {
        config: config,
        ajax: ajax,
        storage: kmapStorage,
        buildMenu: buildMenu,
        getQueryString: getQueryString,
        dateFormate: dateFormate,
        cookieUtils: cookieUtils,
        getToken: getToken,
        refreshToken: refreshToken
    };
});