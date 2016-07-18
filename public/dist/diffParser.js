webpackJsonp([3],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by lihua on 2016/3/28.
	 */

	'use strict';

	var kmap = __webpack_require__(1);
	var $ = __webpack_require__(2);

	var parser = {};
	parser.init = function () {
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

/***/ }
]);