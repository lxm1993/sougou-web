webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by lihua on 2016/2/1.
	 */

	'use strict';

	var kmap = __webpack_require__(1);
	var $ = __webpack_require__(2);
	var bootbox = __webpack_require__(5);
	var instanceDataForm = __webpack_require__(6);

	var commonModule = {};

	commonModule.init = function () {
	    kmap.buildMenu('metaData');
	    var instanceElement;
	    kmap.ajax({
	        url: kmap.config.dataServer + '/recordservice/recordtable/' + kmap.getQueryString('tableId'),
	        type: 'GET',
	        cache: false,
	        dataType: 'json',
	        success: function (data) {
	            if (data && data.schema) {
	                console.dir(data);
	                instanceElement = instanceDataForm.mount({ schema: data.schema }, document.getElementById('form-mount-node'));
	            }
	        },
	        error: function () {
	            bootbox.alert('查询数据失败！', function () {});
	        }
	    });

	    $('#add-data-button').on('click', function () {
	        if (!instanceElement || !instanceElement.state || !instanceElement.state.value) {
	            return;
	        }
	        var data = instanceElement.state.value;
	        kmap.ajax({
	            url: kmap.config.dataServer + '/recordservice/recordtable/' + kmap.getQueryString('tableId') + '/record',
	            type: 'POST',
	            cache: false,
	            contentType: 'application/json',
	            data: JSON.stringify([{ data: JSON.stringify(data) }]),
	            dataType: 'text',
	            success: function () {
	                bootbox.alert('添加成功！', function () {
	                    location.href = '/data/list-instance-data?tableId=' + kmap.getQueryString('tableId');
	                });
	            },
	            error: function () {
	                bootbox.alert('添加失败！', function () {});
	            }
	        });
	    });

	    $('#return-data-list').on('click', function () {
	        location.href = '/data/list-instance-data?tableId=' + kmap.getQueryString('tableId');
	    });
	};
	commonModule.init();

/***/ },

/***/ 6:
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';

	var React = __webpack_require__(7);
	var ReactDom = __webpack_require__(164);
	var subTable = __webpack_require__(165);

	var SubTable = subTable.component;
	var SubFormElem = React.createClass({
	    displayName: 'SubFormElem',

	    getInitialState: function () {
	        return {
	            editable: this.props.editable || false,
	            value: this.props.value || []
	        };
	    },
	    handleClick: function () {

	        this.setState({
	            editable: !this.state.editable
	        });
	    },
	    handleChange: function (event) {
	        this.state.value = event.target.value;
	        this.setState({ value: this.state.value });
	        if (this.props.onChange) {
	            this.props.onChange({ target: { value: this.state.value } });
	        }
	    },
	    render: function () {
	        return React.createElement(
	            'div',
	            null,
	            React.createElement(
	                'a',
	                { key: 'subSchema-link-' + this.props.name, onClick: this.handleClick, className: 'btn btn-link btn-margin-left--12' },
	                React.createElement('span', { className: 'glyphicon glyphicon-th-list' }),
	                ' ',
	                this.state.editable ? '停止编辑' : '编辑数据'
	            ),
	            React.createElement(
	                'div',
	                { key: 'subSchema-wap-' + this.props.name, className: 'data-table-sub-table' },
	                React.createElement(SubTable, { schema: this.props.schema, value: this.state.value, editable: this.state.editable, onChange: this.handleChange })
	            )
	        );
	    }
	});
	var InstanceDataForm = React.createClass({
	    displayName: 'InstanceDataForm',

	    getDefaultProps: function () {
	        return {
	            placeHolders: ['请输入数字', '请输入字符串', '请输入日期', '请输入坐标'],
	            types: ['number', 'text', 'date', 'text']
	        };
	    },
	    getInitialState: function () {
	        var state = {};
	        if (typeof this.props.value === 'object') {
	            state.value = this.props.value;
	        } else {
	            state.value = {};
	        }
	        return state;
	    },

	    handleChange: function (name, event) {
	        this.state.value[name] = event.target.value;
	    },
	    getInput: function (item) {
	        console.dir(item);
	        switch (item.type) {
	            case 0:
	            case 1:
	            case 2:
	            case 3:
	                return React.createElement('input', { type: this.props.types[item.type], className: 'form-control instancedata', value: this.state.value[item.name],
	                    onChange: this.handleChange.bind(this, item.name), name: item.name, placeholder: this.props.placeHolders[item.type] });
	            case 4:
	                return React.createElement(SubFormElem, { name: item.name, schema: item.subSchema, value: this.state.value[item.name], onChange: this.handleChange.bind(this, item.name) });
	        }
	    },
	    creatItem: function (item, index) {
	        return React.createElement(
	            'div',
	            { key: 'add-instance-item-' + index, className: 'form-group row' },
	            React.createElement(
	                'label',
	                { htmlFor: 'columnid-0', className: 'col-sm-2 control-label' },
	                item.name,
	                '：'
	            ),
	            React.createElement(
	                'div',
	                { className: 'col-sm-10' },
	                this.getInput(item)
	            )
	        );
	    },
	    render: function () {
	        return React.createElement(
	            'div',
	            { 'class': this.props.className },
	            this.props.schema.map(this.creatItem)
	        );
	    }
	});
	module.exports = {
	    mount: function (opts, mountNode) {
	        return ReactDom.render(React.createElement(InstanceDataForm, { 'class': opts.className, schema: opts.schema, value: opts.data }), mountNode);
	    }
	};

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