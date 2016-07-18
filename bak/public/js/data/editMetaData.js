'use strict';

define(['kmap', 'jquery', 'underscore', 'bootbox', 'schemaTable'], function(kmap, $, _, bootbox){
    var module = {};
    module.init = function(){
        kmap.buildMenu('metaData');

        kmap.ajax({
            url: kmap.config.dataServer + '/recordservice/recordtable/' + kmap.getQueryString('tableId'),
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function(data){
                if(data){
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

    return module;

    function buildColumnSection(anchorId, schema){
        var $anchor = $('#' + anchorId);
        if($anchor.length < 1){
            return;
        }
        var $anchorParent = $anchor.parent();
        var rowTemplate = _.template(['<div class="form-group row"> ',
            '<div class="col-sm-6"><input type="text" placeholder="请输入列名称" class="form-control input-sm schema-name" value="<%= name %>"/></div> ',
            '<div class="col-sm-6"><select disabled="disabled" class="form-control input-sm schema-type">',
            '<option value="0" <%if(type == 0){%> selected="selected" <%}%> >数值</option> <option value="1" <%if(type == 1){%> selected="selected" <%}%> >字符串</option>',
            '<option value="2" <%if(type == 2){%> selected="selected" <%}%> >日期</option> <option value="3"<%if(type == 3){%> selected="selected" <%}%> >坐标</option> </select> </div>',
            //'<div class="col-sm-2"> <div style="height:26px;padding-top:10px">',
            //'<%if(last){%> <a title="添加" href="javascript:;" class="link-green column-set-add"><span class="glyphicon glyphicon-plus"></span></a>',
            //'<%}else{%><a title="删除" href="javascript:;" class="link-red column-set-delete"><span class="glyphicon glyphicon-remove"></span></a> <%}%>',
            //'</div> </div> ',
            '</div>'].join(''));
        var deleteLinkTemplate = '<a title="删除" href="javascript:;" class="link-red column-set-delete"><span class="glyphicon glyphicon-remove"></span></a>';
        for(var i = schema.length - 1; i >= 0; i--){
            $anchor.after(rowTemplate(schema[i]));
        }

        $anchorParent.on('click', '.column-set-add', function(){
            var $this = $(this);
            var $p = $this.parent();
            var $formgroup = $this.closest('.form-group');

            $p.html(deleteLinkTemplate);
            $formgroup.after(rowTemplate({name:'', type:100}));
        });
        $anchorParent.on('click', '.column-set-delete', function(){
            var $this = $(this);
            var $formgroup = $this.closest('.form-group');
            $formgroup.remove();
        });

    }
});