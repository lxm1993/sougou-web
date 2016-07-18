
'use strict';

define(['react', 'react-dom'], function(React, ReactDom){
    var FormModal = React.createClass({
        
    });

    return {
        mount: function(opts, mountNode){
            ReactDom.render(<FormModal className={opts.className} schema={opts.schema} data={opts.data}></FormModal>, mountNode);
        }
    }
});