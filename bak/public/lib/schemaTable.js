/**
 * Created by lihua on 2016/3/23.
 */

'use strict';

!function($, _){


    var changeIcon = function($tr, type){
        //type: 0:indent,  1:expanded,  2:collapsed:
        var $icon = $tr.find('.schemaicon-indent,.schemaicon-expended,.schemaicon-collapsed').last();
        $icon.removeClass('glyphicon-triangle-bottom schemaicon-expended glyphicon-triangle-right schemaicon-collapsed')
            .addClass('glyphicon-triangle-left schemaicon-indent');
        switch (type) {
            case 0:
                $tr.removeClass('schema-collapsed schema-expanded');
                $icon.removeClass('glyphicon-triangle-bottom schemaicon-expended glyphicon-triangle-right schemaicon-collapsed')
                    .addClass('glyphicon-triangle-left schemaicon-indent');
                break;
            case 1:
                $tr.removeClass('schema-collapsed').addClass('schema-expanded');
                $icon.removeClass('glyphicon-triangle-left schemaicon-indent glyphicon-triangle-right schemaicon-collapsed')
                    .addClass('glyphicon-triangle-bottom schemaicon-expended');
                break;
            case 2:
                $tr.removeClass('schema-expanded').addClass('schema-collapsed');
                $icon.removeClass('glyphicon-triangle-left schemaicon-indent glyphicon-triangle-bottom schemaicon-expended')
                    .addClass('glyphicon-triangle-right schemaicon-collapsed');
                break;

        }
    };

    function SchemaTable(el, options){
        this.$el = $(el);
        this.options = options;
        
        this.init();
    }
    
    SchemaTable.DEFAULTS = {
        initSchemaLength: 3
    };

    SchemaTable.templates = (function(){
        var indentIcon = '<span class="glyphicon glyphicon-triangle-left schemaicon-indent"></span>';
        var addIcon = '<a title="添加" href="javascript:;" class="link-green schema-add"><span class="glyphicon glyphicon-plus"></span></a>&nbsp;&nbsp;&nbsp;';
        var deleteIcon = '<a title="删除" href="javascript:;" class="link-red schema-delete"><span class="glyphicon glyphicon-remove"></span></a>';
        var root = _.template('<tr data-schema-id="root" class="schema-tr schema-expanded"><td>' +
            indentIcon + '<div class="schema-root">所有列</div></td><td>&nbsp;</td><% if(isAdd){ %><td>' + addIcon + '</td><% } %></tr>');
        var tr = _.template('<tr data-schema-id="<%= schemaId %>" data-schema-parent-id="<%= parentId %>" class="schema-tr">' +
            '<td><% for(var i = 0; i <= depth; i++){ %>' + indentIcon + '<% } %>' +
            '<div class="schema-form-control"><input value="<%= schema.name %>" type="text" placeholder="请输入列名称" class="form-control input-sm schema-name"></div></td>' +
            '<td><div class="form-group"><select class="form-control input-sm schema-type">' +
            '<option value="0" <%if(schema.type === 0){%> selected="selected" <%}%> >数值</option> ' +
            '<option value="1" <%if(schema.type === 1){%> selected="selected" <%}%> >字符串</option>' +
            '<option value="2" <%if(schema.type === 2){%> selected="selected" <%}%> >日期</option> ' +
            '<option value="3" <%if(schema.type === 3){%> selected="selected" <%}%> >坐标</option> ' +
            '<option value="4" <%if(schema.type === 4){%> selected="selected" <%}%> >对象</option> </select></div></td>' +
            '<td><%if(schema.type == 4){%> ' + addIcon + ' <%}%>' + deleteIcon + '</td></tr>');
        var tr2 = _.template('<tr data-schema-id="<%= schemaId %>" data-schema-parent-id="<%= parentId %>" class="schema-tr">' +
            '<td><% for(var i = 0; i <= depth; i++){ %>' + indentIcon + '<% } %>' +
            '<div class="schema-form-control"><input value="<%= schema.name %>" type="text" placeholder="请输入列名称" class="form-control input-sm schema-name"></div></td>' +
            '<td><div class="form-group"><select disabled="disabled" class="form-control input-sm schema-type">' +
            '<option value="0" <%if(schema.type === 0){%> selected="selected" <%}%> >数值</option> ' +
            '<option value="1" <%if(schema.type === 1){%> selected="selected" <%}%> >字符串</option>' +
            '<option value="2" <%if(schema.type === 2){%> selected="selected" <%}%> >日期</option> ' +
            '<option value="3" <%if(schema.type === 3){%> selected="selected" <%}%> >坐标</option> ' +
            '<option value="4" <%if(schema.type === 4){%> selected="selected" <%}%> >对象</option> </select></div></td>' +
            '</tr>');
        return {
            indentIcon: indentIcon,
            addIcon: addIcon,
            root: root,
            tr: tr,
            tr2: tr2
        };
    }());

    SchemaTable.prototype.init = function(){
        this.initTable();
        this.bindEvent();
    };

    SchemaTable.prototype.initTable = function(){
        this.$el.empty();
        this.$el.addClass('schema-talbe');
        if (this.options.schema && typeof this.options.schema === 'object') {
            this.initRoot(false);
            this.buildTr(this.options.schema);
        } else {
            this.initRoot(true);
            this.buildEmptyTr(this.options.schemaLength);
        }
    };

    SchemaTable.prototype.initRoot = function(isAdd){
        this.$el.append(SchemaTable.templates.root({isAdd: isAdd}));
    };

    SchemaTable.prototype.buildEmptyTr = function(length, parentId){
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

    SchemaTable.prototype.buildTr = function(schemas, parentId, noExpend){
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
            $insetBeforeElem.after(SchemaTable.templates.tr2(data));
            if (data.schema.subSchema && data.schema.subSchema.length) {
                this.buildTr(data.schema.subSchema, data.schemaId, true);
            }
        }
        if (!noExpend) {
            this.expand(parentId);
        }
        return this;
    };

    SchemaTable.prototype.getDepth = function(id){
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

    SchemaTable.prototype.removeTr = function(id){
        var $tr = this.$el.find('[data-schema-id="' + id + '"]');
        var parentId = $tr.data('schemaParentId');
        $tr.remove();
        var $children = this.$el.find('[data-schema-parent-id="' + id + '"]');
        for (var i = 0; i < $children.length; i++) {
            var $child = $children.eq(i);
            this.removeTr($child.data('schemaId'));
        }
        if(parentId){
            var $sibling = this.$el.find('[data-schema-parent-id="' + parentId + '"]');
            if($sibling.length === 0){
                var $parent = this.$el.find('[data-schema-id="' + parentId + '"]');
                changeIcon($parent, 0);
            }
        }
    };

    SchemaTable.prototype.expand = function(id){
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

    SchemaTable.prototype.collapse = function(id, onlyHide){
        id = id || 'root';
        var $children = this.$el.find('[data-schema-parent-id="' + id + '"]');
        if ($children.length === 0) {
            return;
        }
        if(!onlyHide){
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

    SchemaTable.prototype.bindEvent = function(){
        var that = this;
        this.$el.on('click', '.schemaicon-expended', function(){
            var $tr = $(this).closest('tr');
            that.collapse($tr.data('schemaId'));
        });
        this.$el.on('click', '.schemaicon-collapsed', function(){
            var $tr = $(this).closest('tr');
            that.expand($tr.data('schemaId'));
        });
        this.$el.on('click', '.schema-add', function(){
            var $tr = $(this).closest('tr');
            that.buildEmptyTr(1, $tr.data('schemaId'));
        });
        this.$el.on('click', '.schema-delete', function(){
            var $tr = $(this).closest('tr');
            that.removeTr($tr.data('schemaId'));
        });
        this.$el.on('change', '.schema-type', function(){
            var $tr = $(this).closest('tr');
            var schemaId = $tr.data('schemaId');
            var value = $(this).val();
            if (value === '4') {
                $tr.find('td').last().prepend(SchemaTable.templates.addIcon);
                that.buildEmptyTr(null, schemaId);
            } else {
                var $children = that.$el.find('[data-schema-parent-id="' + schemaId + '"]');
                for (var i = 0; i < $children.length; i++) {
                    that.removeTr(schemaId);
                }
                changeIcon($tr, 0);
                $tr.find('td .schema-add').remove();
            }
        });
        this.$el.on('focus', '.schema-name', function(){
            var $trs = that.$el.find('.schema-tr');
            $trs.removeClass('has-error');
        });

        return this;
    };

    SchemaTable.prototype.getValue = function(){
        return this.getJson();
    };

    SchemaTable.prototype.getJson = function(parentId){
        parentId = parentId || 'root';
        var $children = this.$el.find('[data-schema-parent-id="' + parentId + '"]');
        var result = [];
        var nameMap = {};
        for (var i = 0; i < $children.length; i++){
            var $child = $children.eq(i);
            var schema = {};
            schema.name = $child.find('.schema-name').val();
            schema.type = $child.find('.schema-type').val();
            if (!schema.name) {
                $child.addClass('has-error');
                return {
                    error: '名称不能为空'
                };
            }
            if (nameMap[name]) {
                $child.addClass('has-error');
                return {
                    error: '名称重复'
                };
            }
            if(this.$el.find('[data-schema-parent-id="' + $child.data('schemaId') + '"]').length > 0){
                var json = this.getJson($child.data('schemaId'));
                if(json.error){
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
    
    $.fn.schemaTable = function(option){
        var value,
            args = Array.prototype.slice.call(arguments, 1);
        
        this.each(function(){
            var $this = $(this),
                data = $this.data('schemaTable.data'),
                options = $.extend({}, SchemaTable.DEFAULTS, $this.data(),
                    typeof option === 'object' && option);
            
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