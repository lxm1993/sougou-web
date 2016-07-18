'use strict';

var React = require('react');
var ReactDom = require('react-dom');
var kmap = require('../js/kmap');
var $ = require('jquery');
require('./parseListTable');



var InstanceTaskForm = React.createClass({
    getDefaultProps: function(){
        return {
            placeHolders: ['请输入数字', '请输入字符串', '请输入日期', '请输入字符串'],
            types: ['number', 'text', 'date']
        }
    },
    getInitialState: function(){
        var state = {};
        if (typeof this.props.value === 'object') {
            state.value = this.props.value;
            var myDate = kmap.dateFormate(new Date(this.props.value.lastupdate),'yyyy-MM-dd');
            state.value["lastupdate"] =(myDate);
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
            var myDate = kmap.dateFormate(new Date(),'yyyy-MM-dd');
            state.value["lastupdate"] =(myDate);

        }
        return state;
    },
    componentDidMount:function(){
        console.dir( this.state.value);
        if(this.props.class == "editTask"){
            $('#schemaTable').schemaTable({schema: this.state.value.parser});
        }else {
            $('#schemaTable').schemaTable({schemaLength: 2});
        }
        if(this.state.value.taskLocked == true){
            $("input[name='taskLocked'][value='true']").attr("checked", "checked");
        }
        if(this.state.value.loadImg == true){
            $("input[name='loadImg'][value='true']").attr("checked", "checked");
        }

    },
    handleChange: function(name, event){
        this.state.value[name] = event.target.value;
    },
    getInput: function(item){
        switch(item.type){
            case 0:
            case 1:
            case 2:
                return <input type={this.props.types[item.type]} className="form-control instancedata" defaultValue ={this.state.value[item.key]}
                              onChange={this.handleChange.bind(this, item.key)} name={item.key} placeholder={this.props.placeHolders[item.type]} />;
            case 3:
                return <textarea rows="3" className="form-control instancedata" defaultValue={this.state.value[item.key]}
                          onChange={this.handleChange.bind(this, item.key)} name={item.key} placeholder={this.props.placeHolders[item.type]} />;
            case 4:
                return  <div>
                    <label className="control-label" id="xxx">
                        <input type="radio" value="true" name={item.key} onChange={this.handleChange.bind(this, item.key)}/> True&nbsp;
                        <input type="radio" value="false" name={item.key} defaultChecked onChange={this.handleChange.bind(this, item.key)}/> False
                    </label>
                </div>
            case 6:
                return  <select className="form-control" defaultValue={this.state.value[item.key]} onChange={this.handleChange.bind(this, item.key)} >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="100">100</option>
                    <option value="more">无限值</option>
                </select>
            case 7:
               return <div className="">
                        <table id="schemaTable" style={{"marginLeft":"-20px"}}></table>
                </div>

        }
    },
    creatItem: function(item, index){
        return (
            <div key={'add-instance-item-' + index} className="form-group row">
                <label htmlFor="columnid-0" className="col-sm-2 control-label">{item.name}：</label>
                <div className="col-sm-10">{this.getInput(item)}</div>
            </div>
        );
    },
    render: function(){
        return (
            <div class={this.props.className}>
                {this.props.schema.map(this.creatItem)}
            </div>
        );
    }
});
module.exports = {

mount: function(opts, mountNode){
        return ReactDom.render(<InstanceTaskForm class={opts.className} schema={opts.schema} value={opts.data}></InstanceTaskForm>, mountNode);
    }
};