/**
 * Created by lihua on 2016/3/28.
 */

'use strict';

define(['kmap', 'jquery', 'ace-diff'], function(kmap, $, AceDiff){
    var parser = {};
    parser.init = function(){
        kmap.buildMenu('parser');

        var aceDiffer = new AceDiff({
            mode: 'ace/mode/javascript',
            left: {
                id: 'editor1',
                content: $('#example-content-1').val()
            },
            right: {
                id: "editor2",
                content: $('#example-content-2').val()
            },
            classes: {
                gutterID: 'gutter'
            }
        });

        /*var el = $('#editor1')[0];
        var editor = el.env.editor;
        editor.$blockScrolling = Infinity;
        var el2 = $('#editor2')[0];
        var editor2 = el2.env.editor;
        editor2.$blockScrolling = Infinity;*/
    };

    return parser;
});