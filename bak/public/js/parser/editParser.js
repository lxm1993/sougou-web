/**
 * Created by lihua on 2016/3/17.
 */

'use strict';

define(['kmap', 'jquery', 'ace'], function(kmap, $, ace){
    var parser = {};
    parser.init = function(){
        kmap.buildMenu('parser');

        var editor = buildEditor();
        editor.setValue($('#result-code').val());
    };

    function buildEditor(){
        var initAce = function(){
            var editor = ace.edit('editor');
            editor.setTheme('ace/theme/dawn');
            editor.session.setMode('ace/mode/javascript');
            editor.session.setTabSize(4);
            editor.focus();
        };
        var setValue = function(text){
            try{
                var el = document.getElementById('editor');
                el.env.editor.setValue(text, 1);
            }catch(e){
                console.log(e);
            }
        };
        var getValue = function(){
            try{
                var el = document.getElementById('editor');
                return el.env.editor.getValue();
            }catch(e){
                console.log(e);
                return '';
            }
        };
        var hasError = function(){
            return $('.ace_gutter-cell.ace_error').length > 0;
        };
        initAce();
        return {
            getValue: getValue,
            setValue: setValue,
            hasError: hasError
        };
    }

    return parser;
});