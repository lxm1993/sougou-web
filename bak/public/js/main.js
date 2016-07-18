/**
 * Created by lihua on 2016/3/15.
 */

'use strict';

requirejs.config({
    //urlArgs: "bust=" + (new Date()).getTime(),
    baseUrl: '/js',
    paths:{
        'jso':'../vendor/jso/jso',

        'jquery':'../vendor/jquery/jquery',
        'underscore':'../vendor/underscore/underscore',

        'bootstrap':'../vendor/bootstrap/core/js/bootstrap',
        'bootstrapTable':'../vendor/bootstrap/table/bootstrap-table',
        'bootstrapTableZh':'../vendor/bootstrap/table/bootstrap-table-zh-CN',
        'bootbox': '../vendor/bootstrap/bootbox/bootbox.min',

        'ace': '../vendor/ace-master/src-min-noconflict/ace',
        'ace-diff': '../vendor/ace-master/ace-diff/ace-diff.min',
        'diff-patch': '../vendor/ace-master/ace-diff/diff_match_patch',

        'react':'../vendor/react/react-with-addons',
        'react-dom':'../vendor/react/react-dom',
        'babel':'../vendor/babel/babel-5.8.34.min',
        'jsx':'../vendor/require-jsx/jsx',
        'text':'../vendor/require-jsx/text',

        'schemaTable': '../lib/schemaTable',
        'processData': '../lib/processData'
    },
    shim:{
        'bootstrap':{
            'deps': ['jquery']
        },
        'bootstrapTable':{
            'deps': ['bootstrap']
        },
        'bootstrapTableZh':{
            'deps': ['bootstrapTable']
        },
        'bootbox':{
            'deps': ['bootstrap']
        },
        'jso':{
            'deps': ['jquery']
        },
        'schemaTable':{
            'deps': ['jquery', 'underscore']
        },
        'ace':{
            'exports': 'ace'
        },
        'ace-diff':{
            'exports': 'AceDiff',
            'deps': ['diff-patch', 'ace']
        }
    },
    config: {
        'babel': {
            'sourceMaps': 'inline', // One of [false, 'inline', 'both']. See https://babeljs.io/docs/usage/options/
            'fileExtension': '.jsx' // Can be set to anything, like .es6 or .js. Defaults to .jsx
        }
    }
});
require.onError = function (err) {
    console && console.error(err);
};

require(['kmap'], function(kmap){});

require([window.moduleName || 'default'], function(module){
    module.init();
});
