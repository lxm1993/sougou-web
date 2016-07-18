/**
 * Created by lihua on 2016/3/2.
 */

'use strict';

var kmap = require('../kmap');
var $ = require('jquery');
var bootbox = require('bootbox');

var commonModule = {};
commonModule.init = function(){
    kmap.buildMenu('user');

    buildInstanceTable(kmap.getQueryString('username'));

    $('#deleteTokens').click(function(){
        bootbox.confirm('确认全部删除吗？', function(result) {
            var username = $('#table').data('username');
            if(result){
                kmap.ajax({
                    url: kmap.config.authorizationServer + '/passport/oauth/admins/users/' + username + '/tokens',
                    type: 'DELETE',
                    cache: false,
                    success: function(){
                        $('#table').bootstrapTable('refresh');
                    },
                    error: function(){
                        bootbox.alert('删除失败！', function() {});
                    }

                });
            }
        });
    });
};

commonModule.init();

function buildInstanceTable(username){
    var columns = [{
        searchable: true,
        sortable: true,
        field: 'access_token',
        title: 'token'
    }, {
        searchable: true,
        sortable: true,
        field: 'token_type',
        title: 'token类型'
    }, {
        searchable: true,
        sortable: true,
        field: 'scope',
        title: 'Scope'
    }, {
        searchable: true,
        sortable: true,
        field: 'client_id',
        title: 'Client'
    }, {
        searchable: true,
        sortable: true,
        field: 'create_time',
        title: '创建时间',
        formatter: timeFormatter
    }, {
        searchable: true,
        sortable: true,
        field: 'last_login',
        title: '最后登录时间',
        formatter: timeFormatter
    }/*,{
     searchable: false,
     field: 'operation',
     title: '操作',
     align: 'center',
     width: '120',
     cardVisible: false,
     valign: 'middle',
     formatter: operateFormatter
     }*/];
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
        url: kmap.config.authorizationServer + '/passport/oauth/admins/users/' + username + '/tokens',
        ajax: kmap.ajax,
        toolbar:'#kmap-customer-tool-bar-2',
        columns: columns
    };
    $('#table').bootstrapTable('destroy');
    $('#table').data('rowList', []);
    $('#table').data('username', username);
    $('#table').bootstrapTable(tableInitOptions);

}
function timeFormatter(value){
    if(!value){
        return '';
    }
    return kmap.dateFormate(new Date(value));
}