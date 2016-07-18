/**
 * Created by lihua on 2016/2/29.
 */

'use strict';

var kmap = require('../kmap');
var $ = require('jquery');
var bootbox = require('bootbox');

var commonModule = {};
commonModule.init = function(){
    kmap.buildMenu('user');
    buildTable();

    $('#table').on('click', '.lock-user', function(){
        var username = $(this).closest('tr').find('td').eq(1).text();
        var path;
        if($(this).hasClass('unlocked')){
            path = '/passport/oauth/admins/lockeduser/';
        }else{
            path = '/passport/oauth/admins/unlockeduser/';
        }
        kmap.ajax({
            url: kmap.config.authorizationServer + path + username,
            type: 'PUT',
            cache: false,
            success: function(){
                bootbox.alert('操作成功！', function() {
                    $('#table').bootstrapTable('refresh');
                });
            },
            error: function(){
                bootbox.alert('操作失败！', function() {});
            }

        });
    });

    $('#table').on('click', '.remove-user', function(){
        var username = $(this).closest('tr').find('td').eq(1).text();
        bootbox.confirm('确认删除吗？', function(result) {
            if(result){
                kmap.ajax({
                    url: kmap.config.authorizationServer + '/passport/oauth/admins/users/' + username,
                    type: 'DELETE',
                    cache: false,
                    success: function(){
                        $('#table').bootstrapTable('refresh');
                    },
                    error: function(){
                        bootbox.alert('删除失败！', function() {
                        });
                    }

                });
            }
        });
    });
};

commonModule.init();

function buildTable(){
    var columns = [/*
     {
     searchable: false,
     field: 'selectStatue',
     checkbox: true
     },*/{
        searchable: true,
        sortable: true,
        width: '50',
        field: 'id',
        title: 'ID'
    }, {
        searchable: true,
        sortable: true,
        field: 'username',
        title: '名称'
    }, {
        searchable: true,
        sortable: true,
        field: 'role',
        title: '角色',
        formatter: rollFormatter
    }, {
        searchable: true,
        sortable: true,
        field: 'createTime',
        title: '创建时间',
        formatter: timeFormatter
    }, {
        searchable: true,
        sortable: true,
        field: 'lastloginTime',
        title: '最后登录时间',
        formatter: timeFormatter
    }, {
        searchable: true,
        sortable: true,
        field: 'accountLocked',
        title: '是否锁定',
        formatter: lockFormatter
    }, {
        searchable: false,
        field: 'operation',
        title: '操作',
        align: 'center',
        width: '120',
        cardVisible: false,
        valign: 'middle',
        formatter: operateFormatter
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
        sidePagination: 'server',
        url: kmap.config.authorizationServer + '/passport/oauth/admins/users',
        ajax: kmap.ajax,
        queryParams: queryParams,
        columns: columns,
        formatSearch: function(){
            return '用户名';
        }
    };
    $('#table').bootstrapTable(tableInitOptions);
}
function queryParams(args){
    if(!args){
        return {};
    }
    var params = {};
    typeof args.search !== 'undefined' && (params.q = args.search, params.qf = 'username');
    //typeof args.field !== 'undefined' && (params.qf = args.field);
    typeof args.order !== 'undefined' && (params.odr = args.order);
    typeof args.sort !== 'undefined' && (params.sf = args.sort);
    typeof args.limit !== 'undefined' && (params.limit = args.limit);
    typeof args.offset !== 'undefined' && (params.offset = args.offset);
    try{
        if(params.odr){
            params.odr = params.odr.toUpperCase();
        }
        return params;
    }catch(e){
        return params;
    }
}
function rollFormatter(value){
    if(value === 'ROLE_ADMIN'){
        return '管理员';
    }else{
        return '用户';
    }
}
function lockFormatter(value){
    if(value){
        return '是';
    }else{
        return '否';
    }
}
function timeFormatter(value){
    if(!value){
        return '';
    }
    return kmap.dateFormate(new Date(value));
}
function operateFormatter(value, row, index){
    $(this).closest('tr').attr('id', index);
    var result;
    if(row.accountLocked){
        result = '<a title="解除锁定" href="javascript:;" class="link-red locked lock-user"><span class="glyphicon glyphicon-lock"></span></a>';
    }else{
        result = '<a title="锁定账户" href="javascript:;" class="link-blue unlocked lock-user"><span class="glyphicon glyphicon-lock"></span></a>';
    }
    result += '&nbsp;&nbsp;&nbsp;<a title="删除" href="javascript:;" class="link-red remove-user"><span class="glyphicon glyphicon-remove"></span></a>' +
        '&nbsp;&nbsp;&nbsp;<a title="查看token信息" href="/token/list-token?username=' + row.username + '" class="link-green"><span class="glyphicon glyphicon-th-list"></span></a>';
    return result;
}