/**
 * Created by lihua on 16/7/14.
 */
'use strict';

var kmap = require('../kmap');
var $ = require('jquery');
var bootbox = require('bootbox');

var parser = {};
parser.init = function() {
    kmap.buildMenu('parser');
    buildTable();
    //删除
    $('#table').on('click', '.remove-parser', function(){
        var id = $(this).data('parseId');
        bootbox.confirm('确认删除吗？', function(result) {
            if(result){
            }
        });
    });

    //调试
    $('#table').on('click', '.parser-debug', function(){
        var tableId = $(this).data('tableId');
        GetDebugTable(tableId);
        $('#debug-wrap').css('display', '');
    });
    $('#close-debug-button').click(function(){
        $('#debug-wrap').css('display', 'none');
    });
    $('#add_parser').on('click',function(){
        var stateObj = { foo: "bar" };
        history.pushState(stateObj, "page 2", "2.html");
        //var searchParams = new URLSearchParams(window.location.href);
        //searchParams.append('api_key', '1234567890');
        //alert(searchParams);

    })
}
parser.init();
//解析器表
function buildTable(){
    var columns = [
        {
            searchable:true,
            sortable:true,
            visible:false,
            field:'id',
            title:'ID',
        },{
            searchable:true,
            sortable:true,
            width: '150',
            field:'task_id',
            title:'TaskId',
        },{
            searchable:true,
            sortable:true,
            field:'parser_url',
            title:'Parser',
            formatter: urlFormatter

        },{
            searchable:true,
            sortable:true,
            visible:true,
            field:'table_id',
            title:'表ID',
            formatter: tableIDFormatter

        },{
            searchable:true,
            sortable:true,
            field:'creator',
            title:'创建者	',
        },{
            searchable:true,
            sortable:true,
            visible:false,
            field:'latest_version',
            title:'版本	',
        },{
            searchable: false,
            field: 'operation',
            title: '操作',
            align: 'center',
            width: '100px',
            cardVisible: false,
            valign: 'middle',
            formatter: operateFormatter
        }
    ];
    //假数据,必须写在tableInitOptions前
    var dataParser = [{
        id:'111',
        task_id:'10',
        parser_url:'http://10.134.14.117/parser/multi.mtime.com.movie.js',
        table_id:'10d0de03-7066-441f-ab9a-ba22ab82ec25',
        creator:'none',
        latest_version:'1.0',
    },{
        id:'112',
        task_id:'11',
        parser_url:'http://10.134.14.117/parser/multi.m.maoyan.com.shortdesc.js',
        table_id:'10d0de03-7066-441f-ab9a-ba22ab82ec25',
        creator:'none',
        latest_version:'1.0',
    }
    ];
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
        data:dataParser,
        //url: kmap.config.parserServer,
        //ajax: kmap.ajax,
        toolbar:'#kmap-customer-tool-bar-2',
        columns: columns
    };

    $('#table').bootstrapTable(tableInitOptions);

    function tableIDFormatter(value,row,index){
        var tableHref = "/data/list-instance-data?tableId="+row.table_id;
        var tableStr ='<a href="'+tableHref+'">'+row.table_id+'</a>';
        return tableStr;
    }

    function urlFormatter(value,row,index){
        var parseHref = "/parser/edit-parser?url="+encodeURIComponent(row.parser_url);
        var urlStr ='<a href="'+parseHref+'">'+row.parser_url+'</a>'+
                '&nbsp;&nbsp;<a title="调试" href="javascript:;" data-table-id="'+row.table_id+'" class="link-green parser-debug"><span class="glyphicon glyphicon-expand" style="top:3px"></span></a>';
        return urlStr;
    }
    function operateFormatter(value, row, index) {
        console.dir(row);
        var parseHref = "/parser/edit-parser?url="+encodeURIComponent(row.parser_url);
        var editParser = '<div style="width: 100px"><a title="编辑" ' +
            'href="'+parseHref+'" class="link-blue">' +
            '<span class="glyphicon glyphicon-pencil"></span>' +
            '</a>';
        var deleteParser = '&nbsp;&nbsp;&nbsp;<a title="删除" href="javascript:;"' +
            ' data-parse-id="'+row.id+'" class="link-red remove-parser">' +
            '<span class="glyphicon glyphicon-remove"></span>' +
            '</a>';
        var runParser = '&nbsp;&nbsp;&nbsp;<a title="解析" href="/parser/diff-parser" class="link-green">' +
            '<span class="glyphicon glyphicon-play"></span>' +
            '</a>'+'</div>';

        return[editParser,deleteParser,runParser].join('');
    }

}
//调试表
function GetDebugTable(tableId){
    kmap.ajax({
        url: kmap.config.dataServer + '/recordservice/recordtable/' + tableId,
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function(data){
            if(data && data.schema){
                buildDebugTable(data);
            }
        },
        error: function(){
            bootbox.alert('查询数据失败！', function() {
            });
        }
    });
}

function buildDebugTable(data) {
    var columns = [];
    for (var i = 0; i < data.schema.length; i++) {
        var item = data.schema[i];
        columns.push({
            searchable: true,
            sortable: true,
            field: item.name,
            title: item.name
        });
    }
    var tableInitOptions = {
        classes: 'table table-hover table-condensed',
        showToggle: false,
        search: false,
        showHeader: true,
        striped: true,
        pagination: true,
        smartDisplay: true,
        showColumns: false,
        showRefresh: false,
        undefinedText: '',
        pageNumber: 1,
        pageSize: 10,
        pageList: [5, 10, 25, 50, 100],
        sidePagination: 'client',
        url: kmap.config.dataServer + '/recordservice/recordtable/' + data.tableId + '/record',
        ajax: kmap.ajax,
        responseHandler: responseHandler,
        columns: columns
    };
    $('#debug-table').bootstrapTable('destroy');
    $('#debug-table').bootstrapTable(tableInitOptions);

    function responseHandler(data) {
        var list = [];
        if (data) {
            for (var i = 0; i < data.length; i++) {
                var item = data[i],
                    dataItem = JSON.parse(item.data);
                dataItem.$$row = item.row;
                list.push(dataItem);
            }
        }
        return list;
    }
}

