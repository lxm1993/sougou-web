webpackJsonp([10],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by lihua on 2016/1/4.
	 */

	'use strict';

	var kmap = __webpack_require__(1);
	var $ = __webpack_require__(2);
	var bootbox = __webpack_require__(5);

	var commonModule = {};
	commonModule.init = function () {
	    kmap.buildMenu('metaData');
	    buildTable();

	    $('#table').on('click', '.remove-metadata', function () {
	        var tableId = $(this).data('tableId');
	        alert(tableId);
	        bootbox.confirm('确认删除吗？', function (result) {
	            if (result) {
	                kmap.ajax({
	                    url: kmap.config.dataServer + '/recordservice/recordtable/table/' + tableId,
	                    type: 'GET',
	                    cache: false,
	                    success: function () {
	                        $('#table').bootstrapTable('refresh');
	                    },
	                    error: function () {
	                        bootbox.alert('删除失败！', function () {});
	                    }

	                });
	            }
	        });
	    });
	};

	commonModule.init();

	function buildTable() {
	    var columns = [/*
	                   {
	                   searchable: false,
	                   field: 'selectStatue',
	                   checkbox: true
	                   },*/{
	        searchable: true,
	        sortable: true,
	        visible: false,
	        field: 'tableId',
	        title: 'ID'
	    }, {
	        searchable: true,
	        sortable: true,
	        field: 'name',
	        title: '名称'
	    }, {
	        searchable: true,
	        sortable: true,
	        field: 'description',
	        title: '描述'
	    }, {
	        searchable: true,
	        sortable: true,
	        field: 'creator',
	        title: '创建者'
	    }, {
	        searchable: false,
	        field: 'operation',
	        title: '操作',
	        align: 'center',
	        width: '120',
	        cardVisible: false,
	        valign: 'middle',
	        formatter: operateFormatter
	    }];
	    var tableInitOptions = {
	        classes: 'table table-hover table-condensed',
	        showToggle: true,
	        search: true,
	        showHeader: true,
	        striped: true,
	        pagination: true,
	        smartDisplay: true,
	        showColumns: true,
	        showRefresh: true,
	        undefinedText: '',
	        pageNumber: 1,
	        pageSize: 10,
	        pageList: [5, 10, 25, 50, 100],
	        sidePagination: 'client',
	        url: kmap.config.dataServer + '/recordservice/recordtable/table',
	        ajax: kmap.ajax,
	        toolbar: '#kmap-customer-tool-bar-2',
	        columns: columns
	    };
	    $('#table').bootstrapTable(tableInitOptions);

	    function operateFormatter(value, row, index) {
	        console.dir(row);
	        return ['<a title="编辑" href="/data/edit-meta-data?tableId=', row.tableId, '" class="link-blue"><span class="glyphicon glyphicon-pencil"></span></a>', '&nbsp;&nbsp;&nbsp;<a title="删除" data-table-id="' + row.tableId + '" href="javascript:;" class="link-red remove-metadata"><span class="glyphicon glyphicon-remove"></span></a>', '&nbsp;&nbsp;&nbsp;<a title="查看实例数据" href="/data/list-instance-data?tableId=', row.tableId, '" class="link-green"><span class="glyphicon glyphicon-th-list"></span></a>'].join('');
	    }
	}

/***/ }
]);