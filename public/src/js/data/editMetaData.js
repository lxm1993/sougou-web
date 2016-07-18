'use strict';

var kmap = require('../kmap');
var $ = require('jquery');
var bootbox = require('bootbox');
require('../../lib/schemaTable');

var commonModule = {};
commonModule.init = function(){
    kmap.buildMenu('metaData');

    kmap.ajax({
        url: kmap.config.dataServer + '/recordservice/recordtable/' + kmap.getQueryString('tableId'),
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function(data){
            if(data){
                console.log(data);
                $('#tablename').val(data.name);
                $('#description').val(data.description);
                if(data.schema){
                    //buildColumnSection('column-set-anchor', data.schema);
                    $('#schemaTable').schemaTable({schema: data.schema});
                }
            }
        },
        error: function(){
            bootbox.alert('查询数据失败！', function() {
            });
        }
    });

    $('#add-matadata-button').click(function(){
        var schema = $('#schemaTable').schemaTable('getValue');
        if(schema.error){
            alert(schema.error);
            return;
        }
        var params = {};
        params.tableId = kmap.getQueryString('tableId');
        params.name = $('#tablename').val();
        params.description = $('#description').val();
        params.schema = schema;
        kmap.ajax({
            url: kmap.config.dataServer + '/recordservice/recordtable/table',
            type: 'PUT',
            contentType: 'application/json',
            cache: false,
            data: JSON.stringify(params),
            dataType: 'text',
            success: function(){
                bootbox.alert('修改成功！', function() {
                    location.href = '/data/list-meta-data';
                });
            },
            error: function(){
                bootbox.alert('修改失败！', function() {
                });
            }

        });
    });
};

commonModule.init();