
'use strict';

define(['react', 'react-dom'], function(React, ReactDom){
    var Test = React.createClass({
        render: function(){
            return <h3>{this.props.children}</h3>;
        }
    });

    return {
        mount: function(mountNode){
            ReactDom.render(<Test>lalala</Test>, mountNode);
        },
        Test: Test
    }
});