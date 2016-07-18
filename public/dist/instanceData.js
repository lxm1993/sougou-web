webpackJsonp([8],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by lihua on 2016/1/6.
	 */

	'use strict';

	var kmap = __webpack_require__(1);
	var $ = __webpack_require__(2);
	var bootbox = __webpack_require__(5);
	var subTable = __webpack_require__(165);

	var commonModule = {};
	commonModule.init = function () {
	    kmap.buildMenu('metaData');

	    kmap.ajax({
	        url: kmap.config.dataServer + '/recordservice/recordtable/' + kmap.getQueryString('tableId'),
	        type: 'GET',
	        cache: false,
	        dataType: 'json',
	        success: function (data) {
	            if (data && data.schema) {
	                buildInstanceTable(data);
	            }
	        },
	        error: function () {
	            bootbox.alert('查询数据失败！', function () {});
	        }
	    });

	    $('#addInstanceDataButton').on('click', function () {
	        var item = $('#table').data('record');
	        if (item) {
	            location.href = '/data/add-instance-data?tableId=' + item.tableId;
	        }
	    });
	    $('#table').on('click', '.remove-data', function () {
	        var index = $(this).attr('data-index'),
	            row = $('#table').data('rowList')[index],
	            tableId = $('#table').data('record').tableId;
	        if (row) {
	            bootbox.confirm('确认删除吗？', function (result) {
	                if (result) {
	                    kmap.ajax({
	                        url: kmap.config.dataServer + '/recordservice/recordtable/' + tableId + '/record',
	                        type: 'DELETE',
	                        cache: false,
	                        contentType: 'application/json',
	                        data: JSON.stringify(row),
	                        success: function () {
	                            $('#table').bootstrapTable('refresh');
	                        },
	                        error: function () {
	                            bootbox.alert('删除失败！', function () {});
	                        }

	                    });
	                }
	            });
	        }
	    });

	    $('#file').on('change', function (evt) {
	        var fileName = evt && evt.target && evt.target.files && evt.target.files[0] && evt.target.files[0].name;
	        $('#fileName').val(fileName);
	    });
	    $('#fileName').focus(function () {
	        $(this).blur();
	    });

	    $('#uploadButton').click(function () {
	        if (!$('#fileName').val()) {
	            alert('请选择文件！');
	        }
	        var fd = new FormData($('#upload-form')[0]);
	        var tableId = $('#table').data('record').tableId;
	        kmap.ajax({
	            type: 'POST',
	            url: kmap.config.dataServer + '/recordservice/recordtable/file/' + tableId,
	            data: fd,
	            cache: false,
	            processData: false,
	            contentType: false,
	            success: function () {
	                $('#uploadModal').modal('hide');
	                bootbox.alert('上传成功！', function () {
	                    $('#table').bootstrapTable('refresh');
	                });
	            },
	            error: function () {
	                alert('上传失败！');
	            }
	        });
	    });
	    $('#downLoadButton').click(function () {
	        var tableId = $('#table').data('record').tableId;
	        var fileType = $('#downloadFileType').val();
	        kmap.ajax({
	            type: 'GET',
	            url: kmap.config.dataServer + '/recordservice/recordtable/file/' + tableId + '?fileType=' + fileType,
	            cache: false,
	            success: function () {
	                location.href = kmap.config.dataServer + '/recordservice/recordtable/file/' + tableId + '?fileType=' + fileType + '&access_token=' + kmap.getToken();
	            },
	            error: function () {
	                alert('下载失败！');
	            }
	        });
	    });
	};

	commonModule.init();

	function buildInstanceTable(data) {

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
	    var columns = data.schema.map(function (item) {
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
	        url: kmap.config.dataServer + '/recordservice/recordtable/' + data.tableId + '/record',
	        ajax: kmap.ajax,
	        responseHandler: responseHandler,
	        toolbar: '#kmap-customer-tool-bar-2',
	        columns: columns,
	        onPostBody: function () {
	            funcList.forEach(function (item) {
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
	    function responseHandler(data) {
	        //console.dir(data);
	        var list = [];
	        if (data) {
	            for (var i = 0; i < data.length; i++) {
	                var item = data[i],
	                    dataItem = JSON.parse(item.data);
	                dataItem.$$row = item.row;
	                list.push(dataItem);
	            }
	        }
	        //console.dir(list);

	        return list;
	    }
	    function operateFormatter(value, row, index) {
	        //console.dir(row);

	        $('#table').data('rowList')[index] = row.$$row;
	        return ['<a title="编辑" href="/data/edit-instance-data?tableId=', data.tableId, '&filePos=', row.$$row.filePos, '" class="link-blue"><span class="glyphicon glyphicon-pencil"></span></a>', '&nbsp;&nbsp;&nbsp;', '<a title="删除" href="javascript:;" class="link-red remove-data" data-index="', index, '"><span class="glyphicon glyphicon-remove"></span></a>'].join('');
	    }
	    function cellFormatter(value, row, index) {
	        //执行多次
	        //console.dir(JSON.stringify(value));
	        if (this.subSchema) {
	            var id = 'table-cell-' + index + '-' + this.field;
	            //将函数放入数组,并未执行
	            funcList.push(function (id, schema, data) {
	                return function () {
	                    subTable.mount({ schema: schema, data: data }, document.getElementById(id));
	                };
	            }(id, this.subSchema, value));
	            return '<div id="' + id + '" class="data-table-sub-table">' + JSON.stringify(value) + '</div>';
	        }
	        //console.dir('<div class="data-table-cell">' + value + '</div>');

	        return '<div class="data-table-cell">' + value + '</div>';
	    }
	}

/***/ },

/***/ 165:
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';

	var React = __webpack_require__(7);
	var ReactDom = __webpack_require__(164);

	var SubTable = React.createClass({
	    displayName: 'SubTable',

	    getDefaultProps: function () {
	        return {
	            editable: false
	        };
	    },
	    getInitialState: function () {
	        var emptyObj = {};
	        this.props.schema.forEach(function (item) {
	            emptyObj[item.name] = '';
	        });
	        return {
	            value: this.props.value || [],
	            emptyObj: emptyObj
	        };
	    },
	    componentWillReceiveProps: function (nextProps) {
	        console.dir(nextProps);

	        if (!nextProps.editable) {
	            var valueList = nextProps.value || [],
	                changed = false;
	            for (var i = valueList.length - 1; i >= 0; i--) {
	                var item = valueList[i];
	                var empty = true;
	                for (var key in item) {
	                    if (item.hasOwnProperty(key)) {
	                        if (item[key]) {
	                            empty = false;
	                            break;
	                        }
	                    }
	                }
	                if (empty) {
	                    valueList.splice(i, 1);
	                    changed = true;
	                }
	            }
	            if (changed) {
	                this.setState({ value: valueList });
	                if (this.props.onChange) {
	                    this.props.onChange({ target: { value: valueList.length === 0 ? null : valueList } });
	                }
	            }
	        }
	    },
	    operateClick: function (type, index, events) {
	        var value = this.state.value.slice();
	        if (type === 'delete') {
	            value.splice(index, 1);
	        } else if (type === 'add') {
	            value.push(JSON.parse(JSON.stringify(this.state.emptyObj)));
	        }
	        this.setState({ value: value });
	        if (this.props.onChange) {
	            this.props.onChange({ target: { value: value } });
	        }
	    },
	    handleChange: function (index, name, event) {
	        var value = this.state.value.slice();
	        value[index][name] = event.target.value;
	        this.setState({ value: value });
	        if (this.props.onChange) {
	            this.props.onChange({ target: { value: value } });
	        }
	    },
	    createHeader: function (schema) {
	        var header = schema.map(function (item, index) {
	            return React.createElement(
	                'th',
	                { key: 'sub-table-td-' + index },
	                item.name
	            );
	        });
	        if (this.props.editable) {
	            header.push(React.createElement(
	                'th',
	                { key: 'sub-table-td-operate', className: 'operate-edit' },
	                React.createElement(
	                    'a',
	                    { title: '添加', href: 'javascript:;', onClick: this.operateClick.bind(this, 'add', 0), className: 'link-green' },
	                    React.createElement('span', { className: 'glyphicon glyphicon-plus' })
	                )
	            ));
	        }
	        return React.createElement(
	            'tr',
	            { key: 'sub-table-header' },
	            header
	        );
	    },
	    createCell: function (schema, data) {
	        if (data.length === 0) {
	            data.push(JSON.parse(JSON.stringify(this.state.emptyObj)));
	        }
	        return data.map(function (item, index) {
	            var cells = schema.map(function (it, idx) {
	                if (it.subSchema) {
	                    return React.createElement(
	                        'td',
	                        { key: 'sub-table-td-' + index + '-' + idx },
	                        React.createElement(SubTable, { schema: it.subSchema, value: item[it.name], editable: this.props.editable, onChange: this.handleChange.bind(this, index, it.name) })
	                    );
	                } else {
	                    if (this.props.editable) {
	                        return React.createElement(
	                            'td',
	                            { key: 'sub-table-td-' + index + '-' + idx },
	                            React.createElement('textarea', { onChange: this.handleChange.bind(this, index, it.name), value: item[it.name] })
	                        );
	                    }
	                    return React.createElement(
	                        'td',
	                        { key: 'sub-table-td-' + index + '-' + idx },
	                        item[it.name]
	                    );
	                }
	            }.bind(this));
	            if (this.props.editable) {
	                cells.push(React.createElement(
	                    'td',
	                    { key: 'sub-table-td-' + index + '-operate', className: 'operate-edit' },
	                    React.createElement(
	                        'a',
	                        { title: '删除', href: 'javascript:;', onClick: this.operateClick.bind(this, 'delete', index), className: 'link-red' },
	                        React.createElement('span', { className: 'glyphicon glyphicon-remove' })
	                    )
	                ));
	            }
	            return React.createElement(
	                'tr',
	                { key: 'sub-table-tr-' + index },
	                cells
	            );
	        }.bind(this));
	    },
	    render: function () {
	        if (this.state.value.length === 0 && !this.props.editable) {
	            return null;
	        }
	        return React.createElement(
	            'table',
	            { className: this.props.className },
	            React.createElement(
	                'tbody',
	                null,
	                this.createHeader(this.props.schema),
	                this.createCell(this.props.schema, this.state.value)
	            )
	        );
	    }
	});

	module.exports = {
	    mount: function (opts, mountNode) {
	        //className, schema, value, editable, maxLine, onChange
	        return ReactDom.render(React.createElement(SubTable, { className: opts.className, schema: opts.schema, value: opts.data }), mountNode);
	    },
	    component: SubTable
	};

/***/ }

});