/**
 * Created by lihua on 2016/3/24.
 */

'use strict';

define([], function(){

    /**
     * 根据schema计算表头结构
     * @param schema Array
     */
    var schema2Columns = function(schema){
        var columns = [];
        var inArr = schema;
        var i, j;

        generateParentSchema(schema);
        
        while (inArr.length > 0) {
            columns.push(inArr);
            var outArr = [];
            for (i = 0; i < inArr.length; i++) {
                if (inArr[i].subSchema) {
                    outArr = outArr.concat(inArr[i].subSchema);
                }
            }
            inArr = outArr;
        }
        for (i = columns.length - 1; i >= 0; i--) {
            var subColumns = columns[i];
            for (j = 0; j < subColumns.length; j++) {
                var item = subColumns[j];
                item.schemaWidth = 1;
                item.schemaDepth = 1;
                if(item.subSchema){
                    item.schemaWidth = sumValue(item.subSchema, 'schemaWidth');
                    item.schemaDepth = maxValue(item.subSchema, 'schemaDepth') + 1;
                }
            }
        }
        for (i = columns.length - 1; i >= 0; i--) {
            var subClm = columns[i];
            var maxDepth = maxValue(subClm, 'schemaDepth');
            for (j = 0; j < subClm.length; j++) {
                var itm = subClm[j];
                itm.colspan = itm.schemaWidth;
                itm.rowspan = maxDepth;
                itm.title = itm.name;
                if (!itm.subSchema) {
                    var field = itm.name, temp = itm;
                    while (temp.parentSchema) {
                        temp = temp.parentSchema;
                        field = temp.name + '###' + field;
                    }
                    itm.field = field;
                    itm.searchable = true;
                    itm.sortable = true;
                } else {
                    itm.rowspan = maxDepth - maxSchemaRowSpan(itm.subSchema);
                }
            }
        }

        var result = [];
        for (i = 0; i < columns.length; i++) {
            var row = [];
            var subC = columns[i];
             for (j = 0; j < subC.length; j++) {
                 var ss = subC[j];
                 var cell = {};
                 cell.colspan = ss.colspan;
                 cell.rowspan = ss.rowspan;
                 cell.title = ss.title;
                 cell.schemaDepth = ss.schemaDepth;
                 if (!ss.subSchema) {
                     cell.field = ss.field;
                     cell.searchable = ss.searchable;
                     cell.sortable = ss.sortable;
                 }
                 row.push(cell);
             }
            result.push(row);
        }
        return result;
    };

    var maxValue = function(list, attr){
        var max = 0;
        for (var i = 0; i < list.length; i++) {
            var value = list[i][attr];
            max = value > max ? value : max;
        }
        return max;
    };

    var maxSchemaRowSpan = function(schema){
        var max = 0;
        for (var i = 0; i < schema.length; i++) {
            var item = schema[i];
            var rowspan = item.rowspan;
            if (item.subSchema) {
                rowspan += maxSchemaRowSpan(item.subSchema);
            }
            max = rowspan > max ? rowspan : max;
        }
        return max;
    };

    var sumValue = function(list, attr){
        var sum = 0;
        for (var i = 0; i < list.length; i++) {
            sum += list[i][attr];
        }
        return sum;
    };

    var generateParentSchema = function(schema, parentSchema){
        for (var i = 0; i < schema.length; i++) {
            var item = schema[i];
            if (parentSchema) {
                item.parentSchema = parentSchema;
            }
            if (item.subSchema) {
                generateParentSchema(item.subSchema, item);
            }
        }
    };

    return {
        schema2Columns: schema2Columns,
        maxValue: maxValue
    };
});