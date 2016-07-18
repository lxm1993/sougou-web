
'use strict';

define(['react', 'react-dom', 'jsx!/jsx/subTable'], function(React, ReactDom, subTable){
    var SubTable = subTable.component;
    var SubFormElem = React.createClass({
        getInitialState: function(){
            return {
                editable: this.props.editable || false,
                value: this.props.value || []
            };
        },
        handleClick: function(){
            
            this.setState({
                editable: !this.state.editable
            });
        },
        handleChange: function(event){
            this.state.value = event.target.value;
            this.setState({value: this.state.value});
            if (this.props.onChange){
                this.props.onChange({target:{value:this.state.value}});
            }
        },
        render: function(){
            return (
                <div>
                    <a key={'subSchema-link-' + this.props.name} onClick={this.handleClick} className="btn btn-link btn-margin-left--12">
                        <span className="glyphicon glyphicon-th-list"></span>&nbsp;{this.state.editable ? '停止编辑' : '编辑数据'}
                    </a>
                    <div key={'subSchema-wap-' + this.props.name} className="data-table-sub-table">
                        <SubTable schema={this.props.schema} value={this.state.value} editable={this.state.editable} onChange={this.handleChange}></SubTable>
                    </div>
                </div>
            );
        }
    });
    var InstanceDataForm = React.createClass({
        getDefaultProps: function(){
            return {
                placeHolders: ['请输入数字', '请输入字符串', '请输入日期', '请输入坐标'],
                types: ['number', 'text', 'date', 'text']
            }
        },
        getInitialState: function(){
            var state = {};
            if (typeof this.props.value === 'object') {
                state.value = this.props.value;
            } else {
                state.value = {};
            }
            return state;
        },
        handleChange: function(name, event){
            this.state.value[name] = event.target.value;
            //console.log(this.state.value);
        },
        getInput: function(item){
            switch(item.type){
                case 0:
                case 1:
                case 2:
                case 3:
                    return <input type={this.props.types[item.type]} className="form-control instancedata" value={this.state.value[item.name]}
                                  onChange={this.handleChange.bind(this, item.name)} name={item.name} placeholder={this.props.placeHolders[item.type]} />;
                case 4:
                    return <SubFormElem name={item.name} schema={item.subSchema} value={this.state.value[item.name]} onChange={this.handleChange.bind(this, item.name)}></SubFormElem>;
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

    return {
        mount: function(opts, mountNode){
            return ReactDom.render(<InstanceDataForm class={opts.className} schema={opts.schema} value={opts.data}></InstanceDataForm>, mountNode);
        }
    }
});