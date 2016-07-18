
'use strict';

define(['react', 'react-dom'], function(React, ReactDom){
    var SubTable = React.createClass({
        getDefaultProps: function(){
            return {
                editable: false
            };
        },
        getInitialState: function(){
            var emptyObj = {};
            this.props.schema.forEach(function(item){
                emptyObj[item.name] = '';
            });
            return {
                value: this.props.value || [],
                emptyObj: emptyObj
            };
        },
        componentWillReceiveProps: function(nextProps){
            if (!nextProps.editable) {
                var valueList = nextProps.value || [],
                    changed = false;
                for (var i = valueList.length - 1; i >= 0 ; i--) {
                    var item = valueList[i];
                    var empty = true;
                    for (var key in item) {
                        if (item.hasOwnProperty(key)){
                            if (item[key]) {
                                empty = false;
                                break;
                            }
                        }
                    }
                    if (empty) {
                        valueList.splice(i, 1);
                        changed = true;
                    }
                }
                if (changed) {
                    this.setState({value: valueList});
                    if (this.props.onChange){
                        this.props.onChange({target:{value:valueList.length === 0 ? null : valueList}});
                    }
                }
            }
        },
        createHeader: function(){
            var header = this.props.schema.map(function(item, index){
                return <th key={'sub-table-td-' + index}>{item.name}</th>;
            });
            if (this.props.editable) {
                header.push(<th key={'sub-table-td-operate'} className="operate-edit">
                    <a title="添加" href="javascript:;" onClick={this.operateClick.bind(this, 'add', 0)} className="link-green"><span className="glyphicon glyphicon-plus"></span></a>
                </th>);
            }
            return (
                <tr key={'sub-table-header'}>{header}</tr>
            );
        },
        operateClick: function(type,index, events){
            if (type === 'delete') {
                this.state.value.splice(index, 1);
            } else if (type === 'add') {
                this.state.value.push(JSON.parse(JSON.stringify(this.state.emptyObj)));
            }
            this.setState({value: this.state.value});
            if (this.props.onChange){
                this.props.onChange({target:{value:this.state.value}});
            }
        },
        handleChange: function(index, name, event){
            this.state.value[index][name] = event.target.value;
            this.setState({value: this.state.value});
            if (this.props.onChange){
                this.props.onChange({target:{value:this.state.value}});
            }
        },
        createCell: function(schema, data){
            if (data.length === 0){
                data.push(JSON.parse(JSON.stringify(this.state.emptyObj)));
            }
            return data.map(function(item, index){
                var cells = schema.map(function(it, idx){
                    if (it.subSchema) {
                        return (
                            <td key={'sub-table-td-' + index + '-' + idx}>
                                <SubTable schema={it.subSchema} value={item[it.name]} editable={this.props.editable} onChange={this.handleChange.bind(this, index, it.name)}></SubTable>
                            </td>
                        );
                    } else {
                        if (this.props.editable) {
                            return <td key={'sub-table-td-' + index + '-' + idx}>
                                <textarea onChange={this.handleChange.bind(this, index, it.name)} value={item[it.name]}></textarea>
                            </td>;
                        }
                        return <td key={'sub-table-td-' + index + '-' + idx}>{item[it.name]}</td>;
                    }
                }.bind(this));
                if (this.props.editable) {
                    cells.push(<td key={'sub-table-td-' + index + '-operate'} className="operate-edit">
                        <a title="删除" href="javascript:;" onClick={this.operateClick.bind(this, 'delete', index)} className="link-red"><span className="glyphicon glyphicon-remove"></span></a>
                    </td>);
                }
                return (
                    <tr key={'sub-table-tr-' + index}>{cells}</tr>
                );
            }.bind(this));
        },
        render: function(){
            if (this.state.value.length === 0 && !this.props.editable){
                return null;
            }
            return (
                <table className={this.props.className}>
                    <tbody>
                    {this.createHeader()}
                    {this.createCell(this.props.schema, this.state.value)}
                    </tbody>
                </table>
            );
        }
    });

    return {
        mount: function(opts, mountNode){
            return ReactDom.render(<SubTable className={opts.className} schema={opts.schema} value={opts.data}></SubTable>, mountNode);
        },
        component: SubTable
    }
});