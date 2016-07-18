
'use strict';

var React = require('react');
var ReactDom = require('react-dom');
var Test = React.createClass({
    render: function(){
        return <h3>{this.props.children}</h3>;
    }
});

module.exports = {
    mount: function(mountNode){
        ReactDom.render(<Test>lalala</Test>, mountNode);
    },
    Test: Test
}