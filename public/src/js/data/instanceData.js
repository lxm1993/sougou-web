/**
 * Created by lihua on 2016/1/6.
 */

'use strict';

var kmap = require('../kmap');
var $ = require('jquery');
var bootbox = require('bootbox');
var subTable = require('../../lib/subTable');

var commonModule = {};
commonModule.init = function(){
    kmap.buildMenu('metaData');

    kmap.ajax({
        url: kmap.config.dataServer + '/recordservice/recordtable/' + kmap.getQueryString('tableId'),
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function(data){
            if(data && data.schema){
                buildInstanceTable(data);
            }
        },
        error: function(){
            bootbox.alert('查询数据失败！', function() {
            });
        }
    });

    $('#addInstanceDataButton').on('click', function(){
        var item = $('#table').data('record');
        if(item){
            location.href = '/data/add-instance-data?tableId=' + item.tableId;
        }
    });
    $('#table').on('click', '.remove-data', function(){
        var index = $(this).attr('data-index'),
            row = $('#table').data('rowList')[index],
            tableId = $('#table').data('record').tableId;
        if(row){
            bootbox.confirm('确认删除吗？', function(result) {
                if(result){
                    kmap.ajax({
                        url: kmap.config.dataServer + '/recordservice/recordtable/' + tableId + '/record',
                        type: 'DELETE',
                        cache: false,
                        contentType: 'application/json',
                        data:JSON.stringify(row),
                        success: function(){
                            $('#table').bootstrapTable('refresh');
                        },
                        error: function(){
                            bootbox.alert('删除失败！', function() {});
                        }

                    });
                }
            });
        }
    });

    $('#file').on('change', function(evt){
        var fileName = evt && evt.target && evt.target.files && evt.target.files[0] && evt.target.files[0].name;
        $('#fileName').val(fileName);
    });
    $('#fileName').focus(function(){
        $(this).blur();
    });

    $('#uploadButton').click(function(){
        if(!$('#fileName').val()){
            alert('请选择文件！');
        }
        var fd = new FormData($('#upload-form')[0]);
        var tableId = $('#table').data('record').tableId;
        kmap.ajax({
            type : 'POST',
            url : kmap.config.dataServer + '/recordservice/recordtable/file/' + tableId,
            data : fd,
            cache : false,
            processData : false,
            contentType : false,
            success : function() {
                $('#uploadModal').modal('hide');
                bootbox.alert('上传成功！', function() {
                    $('#table').bootstrapTable('refresh');
                });
            },
            error : function() {
                alert('上传失败！');
            }
        });
    });
    $('#downLoadButton').click(function(){
        var tableId = $('#table').data('record').tableId;
        var fileType = $('#downloadFileType').val();
        kmap.ajax({
            type : 'GET',
            url : kmap.config.dataServer + '/recordservice/recordtable/file/' + tableId + '?fileType=' + fileType,
            cache : false,
            success : function() {
                location.href = kmap.config.dataServer + '/recordservice/recordtable/file/' + tableId + '?fileType=' + fileType + '&access_token=' + kmap.getToken();
            },
            error : function() {
                alert('下载失败！');
            }
        });
    });
};

commonModule.init();

function buildInstanceTable(data){

    console.dir(data);
    var operate = {
        searchable: false,
        field: 'operation',
        title: '操作',
        align: 'center',
        width: '120',
        cardVisible: false,
        valign: 'middle',
        formatter: operateFormatter
    };
    var funcList = [];
    var columns = data.schema.map(function(item){
        item.title = item.name;
        item.field = item.name;
        item.formatter = cellFormatter;
        if (!item.subSchema) {
            item.searchable = true;
            item.sortable = true;
        }
        return item;
    });
    columns.push(operate);

    var tableInitOptions = {
        classes: 'table table-hover table-condensed',
        showToggle: true,
        search: true,
        showHeader: true,
        striped:true,
        pagination: true,
        smartDisplay: true,
        showColumns: true,
        showRefresh: true,
        undefinedText: '',
        pageNumber: 1,
        pageSize: 10,
        pageList: [5, 10, 25, 50, 100],
        sidePagination: 'client',
        url: kmap.config.dataServer + '/recordservice/recordtable/' + data.tableId + '/record',
        ajax: kmap.ajax,
        responseHandler: responseHandler,
        toolbar:'#kmap-customer-tool-bar-2',
        columns: columns,
        onPostBody: function(){
            funcList.forEach(function(item){
                if (typeof item === 'function') {
                    item();
                }
            });
            funcList = [];
        }
    };
    $('#table').bootstrapTable('destroy');
    $('#table').data('rowList', []);
    $('#table').data('record', data);
    $('#table').bootstrapTable(tableInitOptions);
//对数据进行了处理获得data和偏移数据
    function responseHandler(data){
        //console.dir(data);
        var list = [];
        if(data){
            for(var i = 0; i < data.length; i++){
                var item = data[i],
                    dataItem = JSON.parse(item.data);
                dataItem.$$row = item.row;
                list.push(dataItem);
            }
        }
        //console.dir(list);


        return list;
    }
    function operateFormatter(value, row, index){
        //console.dir(row);

        $('#table').data('rowList')[index] = row.$$row;
        return ['<a title="编辑" href="/data/edit-instance-data?tableId=', data.tableId, '&filePos=', row.$$row.filePos,
            '" class="link-blue"><span class="glyphicon glyphicon-pencil"></span></a>', '&nbsp;&nbsp;&nbsp;',
            '<a title="删除" href="javascript:;" class="link-red remove-data" data-index="', index,
            '"><span class="glyphicon glyphicon-remove"></span></a>'].join('');
    }
    function cellFormatter(value, row, index){//执行多次
        //console.dir(JSON.stringify(value));
        if (this.subSchema) {
            var id = 'table-cell-' + index + '-' + this.field;
            //将函数放入数组,并未执行
            funcList.push((function(id, schema, data){
                return function(){
                    subTable.mount({schema: schema, data: data}, document.getElementById(id));
                }
            }(id, this.subSchema, value)));
            return '<div id="' + id + '" class="data-table-sub-table">' + JSON.stringify(value) + '</div>';
        }
        //console.dir('<div class="data-table-cell">' + value + '</div>');

        return '<div class="data-table-cell">' + value + '</div>';
    }
}
