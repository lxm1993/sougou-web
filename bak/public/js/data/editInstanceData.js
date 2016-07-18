/**
 * Created by lihua on 2016/2/18.
 */

'use strict';

define(['kmap', 'jquery', 'underscore', 'bootbox', 'jsx!/jsx/instanceDataForm'], function(kmap, $, _, bootbox, instanceDataForm){
    var module = {};

    module.init = function() {
        kmap.buildMenu('metaData');

        var row,
            instanceElement;

        kmap.ajax({
            url: kmap.config.dataServer + '/recordservice/recordtable/' + kmap.getQueryString('tableId'),
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function(data){
                if(data && data.schema){
                    kmap.ajax({
                        url: kmap.config.dataServer + '/recordservice//recordtable/' + kmap.getQueryString('tableId') + '/record/' + kmap.getQueryString('filePos'),
                        type: 'GET',
                        cache: false,
                        dataType: 'json',
                        success: function(data2){
                            if(data2 && data2.data){
                                row = data2.row;
                                instanceElement = instanceDataForm.mount({schema: data.schema, data: JSON.parse(data2.data)}, document.getElementById('form-mount-node'));
                            }
                        },
                        error: function(){
                            bootbox.alert('查询数据失败！', function() {});
                        }
                    });
                }
            },
            error: function(){
                bootbox.alert('查询数据失败！', function() {});
            }
        });

        $('#edit-data-button').on('click', function(){
            if (!instanceElement || !instanceElement.state || !instanceElement.state.value){
                return;
            }
            var data = instanceElement.state.value;
            kmap.ajax({
                url: kmap.config.dataServer + '/recordservice/recordtable/' + kmap.getQueryString('tableId') + '/record',
                type: 'PUT',
                cache: false,
                contentType: 'application/json',
                data:JSON.stringify({row:row, data:JSON.stringify(data)}),
                dataType: 'text',
                success: function(){
                    bootbox.alert('修改成功！', function() {
                        location.href = '/data/list-instance-data?tableId=' + kmap.getQueryString('tableId');
                    });
                },
                error: function(){
                    bootbox.alert('修改失败！', function() {});
                }
            });
        });

        $('#return-data-list').on('click', function(){
            location.href = '/data/list-instance-data?tableId=' + kmap.getQueryString('tableId');
        });
    };

    return module;
});