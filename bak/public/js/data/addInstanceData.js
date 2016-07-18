/**
 * Created by lihua on 2016/2/1.
 */

'use strict';

define(['kmap', 'jquery', 'underscore', 'bootbox', 'jsx!/jsx/instanceDataForm'], function(kmap, $, _, bootbox, instanceDataForm){
    var module = {};

    module.init = function() {
        kmap.buildMenu('metaData');
        /*$(function () {
            $('#myModal').modal({});
        });*/
        var instanceElement;
        kmap.ajax({
            url: kmap.config.dataServer + '/recordservice/recordtable/' + kmap.getQueryString('tableId'),
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function(data){
                if(data && data.schema){
                    instanceElement = instanceDataForm.mount({schema: data.schema}, document.getElementById('form-mount-node'));
                }
            },
            error: function(){
                bootbox.alert('查询数据失败！', function() {});
            }
        });

        $('#add-data-button').on('click', function(){
            if (!instanceElement || !instanceElement.state || !instanceElement.state.value){
                return;
            }
            var data = instanceElement.state.value;
            kmap.ajax({
                url: kmap.config.dataServer + '/recordservice/recordtable/' + kmap.getQueryString('tableId') + '/record',
                type: 'POST',
                cache: false,
                contentType: 'application/json',
                data:JSON.stringify([{data:JSON.stringify(data)}]),
                dataType: 'text',
                success: function(){
                    bootbox.alert('添加成功！', function() {
                        location.href = '/data/list-instance-data?tableId=' + kmap.getQueryString('tableId');
                    });
                },
                error: function(){
                    bootbox.alert('添加失败！', function() {
                    });
                }
            });
        });

        $('#return-data-list').on('click', function(){
            location.href = '/data/list-instance-data?tableId=' + kmap.getQueryString('tableId');
        });
    };

    return module;
});