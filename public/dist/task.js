webpackJsonp([12],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by lihua on 2015/12/22.
	 */

	'use strict';

	var kmap = __webpack_require__(1);
	var $ = __webpack_require__(2);
	var _ = __webpack_require__(167);
	var bootbox = __webpack_require__(5);

	var table = {};
	table.init = function () {
	    kmap.buildMenu('task');

	    var $table = $('#table');
	    if ($table.length < 1) {
	        return;
	    }
	    var tableInitOptions = {
	        classes: 'table table-hover table-condensed',
	        showToggle: true,
	        search: false,
	        showHeader: true,
	        striped: true,
	        pagination: true,
	        smartDisplay: true,
	        showColumns: true,
	        //showRefresh: true,
	        undefinedText: '',
	        pageNumber: 1,
	        pageSize: 10,
	        pageList: [5, 10, 25, 50, 100],
	        sidePagination: 'server',
	        url: kmap.config.taskServer + '/taskservice/task',
	        ajax: kmap.ajax,
	        queryParams: this.queryParams,
	        toolbar: '#kmap-customer-tool-bar'
	    };

	    tableInitOptions.columns = table.columns;
	    $table.bootstrapTable(tableInitOptions);

	    this.$table = $table;
	    this.$toolbar = $('#kmap-customer-tool-bar');

	    this.bindEvent();
	    return $table;
	};
	table.columns = [{
	    searchable: false,
	    field: 'selectStatue',
	    checkbox: true
	}, {
	    searchable: true,
	    sortable: true,
	    field: 'taskId',
	    title: 'ID',
	    width: '50'
	}, {
	    searchable: true,
	    sortable: true,
	    visible: false,
	    field: 'depth',
	    title: '深度'
	}, {
	    searchable: true,
	    sortable: true,
	    field: 'regex',
	    title: '正则'
	}, {
	    searchable: true,
	    sortable: true,
	    field: 'seeds',
	    title: '种子',
	    formatter: seedFormatter
	}, {
	    searchable: true,
	    sortable: true,
	    visible: false,
	    field: 'listregex',
	    title: '列表页正则'
	}, {
	    searchable: true,
	    sortable: true,
	    visible: false,
	    field: 'listcycle',
	    title: '列表页周期'
	}, {
	    searchable: true,
	    sortable: true,
	    visible: false,
	    field: 'bufferCount',
	    title: '缓存数量'
	}, {
	    searchable: false,
	    sortable: true,
	    'class': 'parser-td',
	    field: 'parser',
	    title: '解析器',
	    formatter: parserFormatter
	}, {
	    searchable: true,
	    sortable: true,
	    visible: false,
	    field: 'cycle',
	    title: '周期'
	}, {
	    searchable: true,
	    sortable: true,
	    field: 'mark',
	    title: '标签'
	}, {
	    searchable: true,
	    sortable: true,
	    field: 'description',
	    title: '描述'
	}, {
	    searchable: true,
	    sortable: true,
	    visible: false,
	    field: 'spiderFreq',
	    title: '抓取频率'
	}, {
	    searchable: true,
	    sortable: true,
	    visible: false,
	    field: 'pageLoadMaxWait',
	    title: '等待时长'
	}, {
	    searchable: true,
	    sortable: true,
	    visible: false,
	    field: 'taskLocked',
	    title: '任务锁定'
	}, {
	    searchable: true,
	    sortable: true,
	    visible: false,
	    field: 'loadImg',
	    title: '加载图片'
	}, {
	    searchable: true,
	    sortable: true,
	    visible: false,
	    field: 'creator',
	    title: '修改人'
	}, {
	    searchable: true,
	    sortable: true,
	    visible: false,
	    field: 'lastupdate',
	    title: '时间'
	}, {
	    searchable: false,
	    field: 'operation',
	    title: '操作',
	    align: 'center',
	    width: '140',
	    cardVisible: false,
	    valign: 'middle',
	    formatter: operateFormatter
	}];
	table.queryParams = function (args) {
	    //console.log(args);
	    if (!args) {
	        return {};
	    }
	    var params = {};
	    typeof args.search !== 'undefined' && (params.q = args.search);
	    typeof args.field !== 'undefined' && (params.qf = args.field);
	    typeof args.order !== 'undefined' && (params.odr = args.order);
	    typeof args.sort !== 'undefined' && (params.sf = args.sort);
	    typeof args.limit !== 'undefined' && (params.limit = args.limit);
	    typeof args.offset !== 'undefined' && (params.offset = args.offset);
	    try {
	        var search = table.$toolbar.find('.search-input').val();
	        if (search) {
	            var field = table.$toolbar.find('.search-select').attr('data-field');
	            params.q = search;
	            params.qf = field;
	        }
	        if (params.odr) {
	            params.odr = params.odr.toUpperCase();
	        }
	        return params;
	    } catch (e) {
	        return params;
	    }
	};
	table.bindEvent = function () {
	    var $toolbar = this.$toolbar;
	    if (!$toolbar) {
	        return;
	    }
	    var $select = $toolbar.find('.search-select'),
	        $list = $toolbar.find('.search-list'),
	        $button = $toolbar.find('.search-button'),
	        $input = $toolbar.find('.search-input');

	    var foformer = kmap.storage.local.getValue('table-search-field') || { title: '正则', field: 'regex' };
	    //console.log(foformer);
	    $select.html(foformer.title + '&nbsp;<span class="caret"></span>');
	    $select.attr('data-field', foformer.field);

	    $select.on('click', function () {
	        var $this = $(this),
	            $parent = $this.parent(),
	            $ul = $this.next('ul');
	        if (!$parent.hasClass('open')) {
	            var columns = table.$table.bootstrapTable('getVisibleColumns'),
	                liList = [];

	            for (var i = 0; i < columns.length; i++) {
	                var clmn = columns[i];
	                if (clmn.field === 'selectStatue' || clmn.field === 'operation' || clmn.field === 'taskId' || clmn.field === 'parser') {
	                    continue;
	                }
	                liList.push('<li><a class="search-column" href="javascript:;" data-field="' + clmn.field + '">' + clmn.title + '</a></li>');
	            }
	            $ul.html(liList.join(''));
	        }
	    });
	    $list.on('click', '.search-column', function () {
	        var field = $(this).attr('data-field'),
	            title = $(this).text();
	        $select.html(title + '&nbsp;<span class="caret"></span>');
	        $select.attr('data-field', field);
	        $input.val('');
	        kmap.storage.local.setValue('table-search-field', { title: title, field: field });
	    });
	    $button.on('click', function () {
	        var search = $input.val();
	        if (search) {
	            table.$table.bootstrapTable('refresh');
	        }
	    });
	    $input.on('keypress', function (evt) {
	        if (evt.keyCode === 13) {
	            table.$table.bootstrapTable('refresh');
	        }
	    });

	    $('#table').on('click', '.parser-debug', function () {
	        var tableId = $(this).closest('td').next('td').text();
	        GetDebugTable(tableId);
	        $('#debug-wrap').css('display', '');
	    });
	    $('#close-debug-button').click(function () {
	        $('#debug-wrap').css('display', 'none');
	    });

	    $('#table').on('click', '.edit-task', function (event) {
	        var tableDataArray = $('#table').bootstrapTable('getData');
	        var clickIndex = $(this).closest('tr').index();
	        var formRowData = tableDataArray[clickIndex];
	        console.dir(formRowData);
	        location.href = '/task/edit-task?taskId=' + formRowData.taskId;
	    });
	    $('#table').on('click', '.delete-task', function (event) {
	        alert("delete");
	    });
	    //$("#edit-cancle").on('click',function(){
	    //    $('#myModal').modal('hide');
	    //});
	};
	table.bindAdvanceSearch = function () {
	    /*var advanceMap = {},
	     advanceTable = $('#advance-search-table');
	     var template = '<tr><td><select><% _.each(options, function(val, key){%>' +
	     '<option value="<%= key %>"><%= value %></option> <%})%>' +
	     '</select></td><td>'
	       <input type="text"/>
	     <a title="添加" href="#" class="link-green advance-search-add"><span class="glyphicon glyphicon-plus"></span></a>
	     </td>
	     </tr>''*/
	    /*for(var i = 0; i < this.columns.length; i++){
	     var item = this.columns[i];
	     if(item.searchable){
	     advanceMap[item.field] = item.field;
	     }
	     }
	     advanceTable.on('click', '.advance-search-add', function(){});*/
	};

	var template = _.template('<table class="parser-table"><tr><th>ID</th><th>URL</th><th>表ID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th><th>创建者</th><th>版本</th></tr>' + '<% _.each(parsers, function(item){ %>' + '<tr><td> <%= item.id %></td>' + '<td class="parser-td"><a href="/parser/edit-parser?url=<%= encodeURIComponent(item.parserUrl) %>"><%= item.parserUrl %></a>' + '&nbsp;&nbsp;<a title="调试" href="javascript:;" class="link-green parser-debug"><span class="glyphicon glyphicon-expand" style="top:3px"></span></a></td>' + '<td><a href="/data/list-instance-data?tableId=<%= item.tableId %>"><%= item.tableId %></a></td>' + '<td> <%= item.creator %></td>' + '<td> <%= item.latestVersion %></td></tr>' + '<% }) %>' + '</table>');
	function parserFormatter(value, row) {
	    if (value && typeof value === 'string') {
	        return '<a href="/parser/list-parser?parser=' + encodeURIComponent(value) + '">' + value + '</a>';
	    } else if (value instanceof Array) {
	        //console.dir(value);
	        return template({ parsers: value });
	    } else {
	        return '';
	    }
	}
	function seedFormatter(value) {
	    var vlist = value.split(/\s+/),
	        hlist = [];
	    for (var i = 0; i < vlist.length; i++) {
	        var item = vlist[i];
	        if (item) {
	            hlist.push('<a href="' + item + '" target="_blank">' + item + '</a>');
	        }
	    }
	    return hlist.join('');
	}
	function operateFormatter(value, row, index) {
	    console.dir(row);
	    //console.dir(index);

	    var name = row.taskId || '';
	    var result = ['<a title="修改" href="javascript:;" class="link-blue edit-task"><span class="glyphicon glyphicon-pencil"></span></a>', '&nbsp;&nbsp;&nbsp;', '<a title="删除" href="javascript:;" class="link-red delete-task"><span class="glyphicon glyphicon-remove"></span></a>', '&nbsp;&nbsp;&nbsp;', '<a title="运行" href="javascript:;" class="link-green startTask" name="', name, '"><span class="glyphicon glyphicon-play"></span></a>', '&nbsp;&nbsp;&nbsp;', '<a title="停止" href="javascript:;" class="link-red" name="', name, '"><span class="glyphicon glyphicon-stop"></span></a>'];
	    result.push('<div id="' + name + '" style="display:none">');
	    for (var k in row) {
	        if (row.hasOwnProperty(k)) {
	            if (k === 'parser') {
	                result.push('<span class="' + k + '">');
	                var parserArray = row[k];
	                for (var i = 0; i < parserArray.length; i++) {
	                    result.push('<span class="parserUrl">' + parserArray[i].parserUrl + '</span>');
	                }
	                result.push('</span>');
	            } else {
	                result.push('<span class="' + k + '">' + row[k] + '</span>');
	            }
	        }
	    }
	    result.push('</div>');
	    return result.join('');
	}
	function GetDebugTable(tableId) {
	    kmap.ajax({
	        url: kmap.config.dataServer + '/recordservice/recordtable/' + tableId,
	        type: 'GET',
	        cache: false,
	        dataType: 'json',
	        success: function (data) {
	            if (data && data.schema) {
	                buildDebugTable(data);
	            }
	        },
	        error: function () {
	            bootbox.alert('查询数据失败！', function () {});
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
	        toolbar: '#kmap-customer-tool-bar-2',
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
	table.init();

/***/ }
]);