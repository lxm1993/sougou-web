/**
 * Created by lihua on 2016/1/5.
 */

'use strict';

var kmap = require('../kmap');
var $ = require('jquery');
var bootbox = require('bootbox');
require('../../lib/schemaTable');

var commonModule = {};
commonModule.init = function(){
    kmap.buildMenu('metaData');

    $('#schemaTable').schemaTable({schemaLength: 5});

    $('#add-matadata-button').click(function(){
        var schema = $('#schemaTable').schemaTable('getValue');
        if(schema.error){
            alert(schema.error);
            return;
        }
        var params = {};
        params.name = $('#tablename').val();
        params.description = $('#description').val();
        params.schema = schema;
        console.dir(params);
        kmap.ajax({
            url: kmap.config.dataServer + '/recordservice/record/table',
            type: 'POST',
            contentType: 'application/json',
            cache: false,
            data: JSON.stringify(params),
            dataType: 'text',
            success: function(){
                bootbox.alert('添加成功！', function() {
                    location.href = '/data/list-meta-data';
                });
            },
            error: function(){
                bootbox.alert('添加失败！', function() {});
            }

        });
    });
};

commonModule.init();