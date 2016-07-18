/**
 * Created by lihua on 2016/3/28.
 */

'use strict';

var kmap = require('../kmap');
var $ = require('jquery');

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
            id: 'editor2',
            content: $('#example-content-2').val()
        },
        classes: {
            gutterID: 'gutter'
        }
    });
};
parser.init();