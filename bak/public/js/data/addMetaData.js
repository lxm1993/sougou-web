/**
 * Created by lihua on 2016/1/5.
 */

'use strict';

define(['kmap', 'jquery', 'underscore', 'bootbox', 'schemaTable'], function(kmap, $, _, bootbox){
    var module = {};
    module.init = function(){
        kmap.buildMenu('metaData');
        //buildColumnSection('column-set-anchor');

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
            kmap.ajax({
                url: kmap.config.dataServer + '/recordservice/recordtable/table',
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

    return module;

    function buildColumnSection(anchorId){
        var $anchor = $('#' + anchorId);
        if($anchor.length < 1){
            return;
        }
        var $anchorParent = $anchor.parent();
        var rowTemplate = ['<div class="form-group row"> ',
            '<div class="col-sm-5"><input type="text" placeholder="请输入列名称" class="form-control input-sm schema-name" /></div> ',
            '<div class="col-sm-5"><select class="form-control input-sm schema-type"> <option value="0">数值</option> <option value="1">字符串</option> <option value="2">日期</option> <option value="3">坐标</option> </select> </div>',
            '<div class="col-sm-2"> <div style="height:26px;padding-top:10px"> <a title="添加" href="javascript:;" class="link-green column-set-add"><span class="glyphicon glyphicon-plus"></span></a></div> </div> ',
            '</div>'].join('');
        var deleteLinkTemplate = '<a title="删除" href="javascript:;" class="link-red column-set-delete"><span class="glyphicon glyphicon-remove"></span></a>';
        /*var headTemplate = '<div class="form-group row" style="font-size: 13px;margin-top: 10px;margin-bottom: 5px"> <div class="col-sm-5"><span>列名称</span></div> <div class="col-sm-5"><span>数据类型</span></div> <div class="col-sm-2"><span>操作</span></div> </div>';
        $anchor.after(headTemplate + rowTemplate);*/
        $anchor.after(rowTemplate);

        $anchorParent.on('click', '.column-set-add', function(){
            var $this = $(this);
            var $p = $this.parent();
            var $formgroup = $this.closest('.form-group');

            $p.html(deleteLinkTemplate);
            //$formgroup.find('input,select').attr('disabled', 'disabled');
            $formgroup.after(rowTemplate);
        });
        $anchorParent.on('click', '.column-set-delete', function(){
            var $this = $(this);
            var $formgroup = $this.closest('.form-group');
            $formgroup.remove();
        });
        var index = 1;
        var intervalId = setInterval(function(){
            if(index >= 5){
                clearInterval(intervalId);
                return;
            }
            index++;
            $anchorParent.find('.column-set-add').click();
        }, 100);

    }
});