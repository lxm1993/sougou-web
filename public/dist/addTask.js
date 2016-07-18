webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by lihua on 16/7/4.
	 */
	'use strict';

	var kmap = __webpack_require__(1);
	var $ = __webpack_require__(2);
	var bootbox = __webpack_require__(5);
	var instanceDataForm = __webpack_require__(168);

	$(function () {
	    kmap.buildMenu('task');
	    var instanceElement;
	    var names = {
	        "regex": "正则",
	        "seeds": "种子",
	        "parser": "解析器",
	        "mark": "标签",
	        "description": "描述",
	        "depth": "深度",
	        "listregex": "列表页正则",
	        "listcycle": "列表页周期",
	        "spiderFreq": "抓取频率",
	        "pageLoadMaxWait": "抓取时长",
	        "bufferCount": "缓存数量",
	        "cycle": "周期",
	        "lastupdate": "时间",
	        "taskLocked": "任务锁定",
	        "loadImg": "加载图片"
	    };
	    var types = [1, 1, 7, 1, 3, 6, 3, 0, 0, 0, 0, 0, 2, 4, 4]; //0 num, 1 textInput ,2 data, 3text ,4,radio,5,form,6 select
	    var taskSchema = [];
	    var keys = Object.keys(names);
	    for (var i = 0; i < keys.length; i++) {
	        var item = new Object();
	        item.key = keys[i];
	        item.name = names[item.key];
	        item.type = types[i];
	        taskSchema.push(item);
	    }
	    //var values = new Object();
	    //values["depth"] = "1";
	    //values["loadImg"] = false;
	    //values["taskLocked"] = false;
	    //values["listcycle"] = 7200;
	    //values["pageLoadMaxWait"] = 200;
	    //values["spiderFreq"] = 1;
	    //values["cycle"] = 1;
	    //values["bufferCount"] = 1;
	    //var myDate = kmap.dateFormate(new Date(),'yyyy-MM-dd');
	    //values["lastupdate"] =(myDate);
	    instanceElement = instanceDataForm.mount({ className: "addTask", schema: taskSchema }, document.getElementById('add-Task'));

	    $('#add-taskData-button').on('click', function () {
	        if (!instanceElement || !instanceElement.state || !instanceElement.state.value) {
	            return;
	        }
	        var data = instanceElement.state.value;
	        var parses = $('#schemaTable').schemaTable('getValue');
	        if (parses.error) {
	            return;
	        }
	        data.parser = parses;
	        console.dir(data);
	        kmap.ajax({
	            url: kmap.config.dataServer + '/recordservice/recordtable/' + '39bffc49-0bf8-40b9-8181-69ea93fa82ca' + '/record',
	            type: 'POST',
	            cache: false,
	            contentType: 'application/json',
	            data: JSON.stringify([{ data: JSON.stringify(data) }]),
	            dataType: 'text',
	            success: function () {
	                bootbox.alert('添加成功！', function () {
	                    location.href = '/task/list-task';
	                });
	            },
	            error: function () {
	                bootbox.alert('添加失败！', function () {});
	            }
	        });
	    });
	});

/***/ },

/***/ 168:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(7);
	var ReactDom = __webpack_require__(164);
	var kmap = __webpack_require__(1);
	var $ = __webpack_require__(2);
	__webpack_require__(169);

	var InstanceTaskForm = React.createClass({
	    displayName: 'InstanceTaskForm',

	    getDefaultProps: function () {
	        return {
	            placeHolders: ['请输入数字', '请输入字符串', '请输入日期', '请输入字符串'],
	            types: ['number', 'text', 'date']
	        };
	    },
	    getInitialState: function () {
	        var state = {};
	        if (typeof this.props.value === 'object') {
	            state.value = this.props.value;
	            var myDate = kmap.dateFormate(new Date(this.props.value.lastupdate), 'yyyy-MM-dd');
	            state.value["lastupdate"] = myDate;
	        } else {
	            state.value = {};
	            state.value["depth"] = "1";
	            state.value["loadImg"] = false;
	            state.value["taskLocked"] = false;
	            state.value["listcycle"] = 7000;
	            state.value["pageLoadMaxWait"] = 100;
	            state.value["spiderFreq"] = 3;
	            state.value["cycle"] = 3000;
	            state.value["bufferCount"] = 3;
	            var myDate = kmap.dateFormate(new Date(), 'yyyy-MM-dd');
	            state.value["lastupdate"] = myDate;
	        }
	        return state;
	    },
	    componentDidMount: function () {
	        console.dir(this.state.value);
	        if (this.props.class == "editTask") {
	            $('#schemaTable').schemaTable({ schema: this.state.value.parser });
	        } else {
	            $('#schemaTable').schemaTable({ schemaLength: 2 });
	        }
	        if (this.state.value.taskLocked == true) {
	            $("input[name='taskLocked'][value='true']").attr("checked", "checked");
	        }
	        if (this.state.value.loadImg == true) {
	            $("input[name='loadImg'][value='true']").attr("checked", "checked");
	        }
	    },
	    handleChange: function (name, event) {
	        this.state.value[name] = event.target.value;
	    },
	    getInput: function (item) {
	        switch (item.type) {
	            case 0:
	            case 1:
	            case 2:
	                return React.createElement('input', { type: this.props.types[item.type], className: 'form-control instancedata', defaultValue: this.state.value[item.key],
	                    onChange: this.handleChange.bind(this, item.key), name: item.key, placeholder: this.props.placeHolders[item.type] });
	            case 3:
	                return React.createElement('textarea', { rows: '3', className: 'form-control instancedata', defaultValue: this.state.value[item.key],
	                    onChange: this.handleChange.bind(this, item.key), name: item.key, placeholder: this.props.placeHolders[item.type] });
	            case 4:
	                return React.createElement(
	                    'div',
	                    null,
	                    React.createElement(
	                        'label',
	                        { className: 'control-label', id: 'xxx' },
	                        React.createElement('input', { type: 'radio', value: 'true', name: item.key, onChange: this.handleChange.bind(this, item.key) }),
	                        ' True ',
	                        React.createElement('input', { type: 'radio', value: 'false', name: item.key, defaultChecked: true, onChange: this.handleChange.bind(this, item.key) }),
	                        ' False'
	                    )
	                );
	            case 6:
	                return React.createElement(
	                    'select',
	                    { className: 'form-control', defaultValue: this.state.value[item.key], onChange: this.handleChange.bind(this, item.key) },
	                    React.createElement(
	                        'option',
	                        { value: '0' },
	                        '0'
	                    ),
	                    React.createElement(
	                        'option',
	                        { value: '1' },
	                        '1'
	                    ),
	                    React.createElement(
	                        'option',
	                        { value: '2' },
	                        '2'
	                    ),
	                    React.createElement(
	                        'option',
	                        { value: '3' },
	                        '3'
	                    ),
	                    React.createElement(
	                        'option',
	                        { value: '4' },
	                        '4'
	                    ),
	                    React.createElement(
	                        'option',
	                        { value: '5' },
	                        '5'
	                    ),
	                    React.createElement(
	                        'option',
	                        { value: '10' },
	                        '10'
	                    ),
	                    React.createElement(
	                        'option',
	                        { value: '100' },
	                        '100'
	                    ),
	                    React.createElement(
	                        'option',
	                        { value: 'more' },
	                        '无限值'
	                    )
	                );
	            case 7:
	                return React.createElement(
	                    'div',
	                    { className: '' },
	                    React.createElement('table', { id: 'schemaTable', style: { "marginLeft": "-20px" } })
	                );

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
	        return ReactDom.render(React.createElement(InstanceTaskForm, { 'class': opts.className, schema: opts.schema, value: opts.data }), mountNode);
	    }
	};

/***/ },

/***/ 169:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by lihua on 16/7/11.
	 */
	'use strict';

	var _ = __webpack_require__(167);

	!function ($, _) {

	    var changeIcon = function ($tr, type) {

	        //type: 0:indent,  1:expanded,  2:collapsed:
	        var $icon = $tr.find('.schemaicon-indent,.schemaicon-expended,.schemaicon-collapsed').last();
	        $icon.removeClass('glyphicon-triangle-bottom schemaicon-expended glyphicon-triangle-right schemaicon-collapsed').addClass('glyphicon-triangle-left schemaicon-indent');
	        switch (type) {
	            case 0:
	                $tr.removeClass('schema-collapsed schema-expanded');
	                $icon.removeClass('glyphicon-triangle-bottom schemaicon-expended glyphicon-triangle-right schemaicon-collapsed').addClass('glyphicon-triangle-left schemaicon-indent');
	                break;
	            case 1:
	                $tr.removeClass('schema-collapsed').addClass('schema-expanded');
	                $icon.removeClass('glyphicon-triangle-left schemaicon-indent glyphicon-triangle-right schemaicon-collapsed').addClass('glyphicon-triangle-bottom schemaicon-expended');
	                break;
	            case 2:
	                $tr.removeClass('schema-expanded').addClass('schema-collapsed');
	                $icon.removeClass('glyphicon-triangle-left schemaicon-indent glyphicon-triangle-bottom schemaicon-expended').addClass('glyphicon-triangle-right schemaicon-collapsed');
	                break;

	        }
	    };

	    function SchemaTable(el, options) {

	        //console.dir(el);
	        //console.dir(options);

	        this.$el = $(el);
	        this.options = options;

	        this.init();
	    }

	    SchemaTable.DEFAULTS = {
	        initSchemaLength: 3
	    };

	    SchemaTable.templates = function () {
	        var indentIcon = '<span class="glyphicon glyphicon-triangle-left schemaicon-indent"></span>';
	        var addIcon = '<a title="添加" href="javascript:;" class="link-green schema-add"><span class="glyphicon glyphicon-plus"></span></a>';
	        var deleteIcon = '<a title="删除" href="javascript:;" class="link-red schema-delete"><span class="glyphicon glyphicon-remove"></span></a>';
	        var root = _.template('<tr data-schema-id="root" class="schema-tr schema-expanded"><td>' + indentIcon + '<div class="schema-root">所有解析器</div></td><td>&nbsp;</td><% if(isAdd){ %><td>' + addIcon + '</td><% } %></tr>');
	        var tr = _.template('<tr data-schema-id="<%= schemaId %>" data-schema-parent-id="<%= parentId %>" class="schema-tr">' + '<td><% for(var i = 0; i <= depth; i++){ %>' + indentIcon + '<% } %>' + '<div class="schema-form-control"><input value="<%= schema.parserUrl %>" type="text" placeholder="输入解析器" class="form-control schema-name"></div></td>' + '<td>' + deleteIcon + '</td></tr>');
	        return {
	            indentIcon: indentIcon,
	            addIcon: addIcon,
	            root: root,
	            tr: tr

	        };
	    }();

	    SchemaTable.prototype.init = function () {
	        this.initTable();
	        this.bindEvent();
	    };

	    SchemaTable.prototype.initTable = function () {
	        this.$el.empty(); //使用 empty() 方法从元素移除内
	        this.$el.addClass('schema-talbe');

	        if (this.options.schema && typeof this.options.schema === 'object') {
	            this.initRoot(false);
	            this.buildTr(this.options.schema);
	        } else {
	            this.initRoot(true);
	            this.buildEmptyTr(this.options.schemaLength);
	        }
	    };

	    SchemaTable.prototype.initRoot = function (isAdd) {
	        this.$el.append(SchemaTable.templates.root({ isAdd: isAdd }));
	    };

	    SchemaTable.prototype.buildEmptyTr = function (length, parentId) {
	        parentId = parentId || 'root';
	        length = length || SchemaTable.DEFAULTS.initSchemaLength;
	        var data = {};
	        var defaultSchema = {
	            name: '',
	            type: 0
	        };
	        var $lastSibling = this.$el.find('[data-schema-parent-id="' + parentId + '"]').last();
	        if ($lastSibling.length === 0) {
	            $lastSibling = this.$el.find('[data-schema-id="' + parentId + '"]');
	        }
	        data.parentId = parentId;
	        data.depth = this.getDepth(parentId) + 1;
	        for (var i = 0; i < length; i++) {
	            data.schemaId = 'id' + Math.floor(Math.random() * 10000);
	            data.schema = defaultSchema;
	            $lastSibling.after(SchemaTable.templates.tr(data));
	        }

	        this.expand(parentId);
	        return this;
	    };

	    SchemaTable.prototype.buildTr = function (schemas, parentId, noExpend) {
	        //console.dir(schemas);
	        parentId = parentId || 'root';
	        var data = {};
	        data.parentId = parentId;
	        data.depth = this.getDepth(parentId) + 1;
	        for (var k = 0; k < schemas.length; k++) {
	            data.schemaId = 'id' + Math.floor(Math.random() * 10000);
	            data.schema = schemas[k];
	            var $insetBeforeElem, $childElem;
	            $childElem = this.$el.find('[data-schema-id="' + parentId + '"]');
	            do {
	                $insetBeforeElem = $childElem;
	                $childElem = this.$el.find('[data-schema-parent-id="' + $insetBeforeElem.data('schemaId') + '"]').last();
	            } while ($childElem.length > 0);
	            $insetBeforeElem.after(SchemaTable.templates.tr(data));
	        }
	        if (!noExpend) {
	            this.expand(parentId);
	        }
	        return this;
	    };

	    SchemaTable.prototype.getDepth = function (id) {
	        var $tr = this.$el.find('[data-schema-id="' + id + '"]');
	        var parentId = $tr.data('schemaParentId');
	        var depth = 0;
	        while (parentId) {
	            $tr = this.$el.find('[data-schema-id="' + parentId + '"]');
	            if ($tr.length > 0) {
	                depth++;
	            }
	            parentId = $tr.data('schemaParentId');
	        }
	        return depth;
	    };

	    SchemaTable.prototype.removeTr = function (id) {
	        var $tr = this.$el.find('[data-schema-id="' + id + '"]');
	        var parentId = $tr.data('schemaParentId');
	        $tr.remove();
	        var $children = this.$el.find('[data-schema-parent-id="' + id + '"]');
	        for (var i = 0; i < $children.length; i++) {
	            var $child = $children.eq(i);
	            this.removeTr($child.data('schemaId'));
	        }
	        if (parentId) {
	            var $sibling = this.$el.find('[data-schema-parent-id="' + parentId + '"]');
	            if ($sibling.length === 0) {
	                var $parent = this.$el.find('[data-schema-id="' + parentId + '"]');
	                changeIcon($parent, 0);
	            }
	        }
	    };

	    SchemaTable.prototype.expand = function (id) {
	        id = id || 'root';
	        var $children = this.$el.find('[data-schema-parent-id="' + id + '"]');
	        if ($children.length === 0) {
	            return;
	        }
	        var $tr = this.$el.find('[data-schema-id="' + id + '"]');
	        changeIcon($tr, 1);
	        for (var i = 0; i < $children.length; i++) {
	            var $child = $children.eq(i);
	            $child.css('display', '');
	            if (!$child.hasClass('schema-collapsed')) {
	                this.expand($child.data('schemaId'));
	            }
	        }
	        return this;
	    };

	    SchemaTable.prototype.collapse = function (id, onlyHide) {
	        id = id || 'root';
	        var $children = this.$el.find('[data-schema-parent-id="' + id + '"]');
	        if ($children.length === 0) {
	            return;
	        }
	        if (!onlyHide) {
	            var $tr = this.$el.find('[data-schema-id="' + id + '"]');
	            changeIcon($tr, 2);
	        }
	        for (var i = 0; i < $children.length; i++) {
	            var $child = $children.eq(i);
	            $child.css('display', 'none');
	            this.collapse($child.data('schemaId'), true);
	        }
	        return this;
	    };

	    SchemaTable.prototype.bindEvent = function () {
	        var that = this;
	        this.$el.on('click', '.schemaicon-expended', function () {
	            var $tr = $(this).closest('tr');
	            that.collapse($tr.data('schemaId'));
	        });
	        this.$el.on('click', '.schemaicon-collapsed', function () {
	            var $tr = $(this).closest('tr');
	            that.expand($tr.data('schemaId'));
	        });
	        this.$el.on('click', '.schema-add', function () {
	            var $tr = $(this).closest('tr');
	            that.buildEmptyTr(1, $tr.data('schemaId'));
	        });
	        this.$el.on('click', '.schema-delete', function () {
	            var $tr = $(this).closest('tr');
	            that.removeTr($tr.data('schemaId'));
	        });

	        this.$el.on('focus', '.schema-name', function () {
	            var $trs = that.$el.find('.schema-tr');
	            $trs.removeClass('has-error');
	        });

	        return this;
	    };

	    SchemaTable.prototype.getValue = function () {
	        return this.getJson();
	    };

	    SchemaTable.prototype.getJson = function (parentId) {
	        parentId = parentId || 'root';
	        var $children = this.$el.find('[data-schema-parent-id="' + parentId + '"]');
	        var result = [];
	        for (var i = 0; i < $children.length; i++) {
	            var $child = $children.eq(i);
	            var schema = {};
	            schema.parserUrl = $child.find('.schema-name').val();
	            //schema.type = $child.find('.schema-type').val();
	            if (!schema.parserUrl) {
	                $child.addClass('has-error');
	                return {
	                    error: '解析器不能为空'
	                };
	            }

	            if (this.$el.find('[data-schema-parent-id="' + $child.data('schemaId') + '"]').length > 0) {
	                var json = this.getJson($child.data('schemaId'));
	                if (json.error) {
	                    return json;
	                }
	                schema.subSchema = json;
	            }
	            result.push(schema);
	        }
	        $children.removeClass('has-error');
	        return result;
	    };

	    var allowedMethods = ['getValue'];

	    $.fn.schemaTable = function (option) {

	        var value,
	            args = Array.prototype.slice.call(arguments, 1);

	        this.each(function () {
	            var $this = $(this),
	                data = $this.data('schemaTable.data'),
	                options = $.extend({}, SchemaTable.DEFAULTS, $this.data(), typeof option === 'object' && option);
	            //console.dir(options);
	            //console.dir(allowedMethods);
	            //console.dir(typeof option === 'object' && option);

	            if (typeof option === 'string') {
	                if ($.inArray(option, allowedMethods) < 0) {
	                    throw new Error("Unknown method: " + option);
	                }

	                if (!data) {
	                    return;
	                }

	                value = data[option].apply(data, args);

	                if (option === 'destroy') {

	                    $this.removeData('schemaTable.data');
	                }
	            }
	            console.dir(options);
	            if (!data) {
	                $this.data('schemaTable.data', new SchemaTable(this, options));
	            }
	        });
	        return typeof value === 'undefined' ? this : value;
	    };
	    $.fn.schemaTable.Constructor = SchemaTable;
	    $.fn.schemaTable.defaults = SchemaTable.DEFAULTS;
	    $.fn.schemaTable.templates = SchemaTable.templates;
	    $.fn.schemaTable.methods = allowedMethods;

	    $(function () {
	        $('[data-toggle="schema"]').schemaTable();
	    });

	    /* global jQuery,_*/
	}(jQuery, _);

/***/ }

});