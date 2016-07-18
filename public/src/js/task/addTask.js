/**
 * Created by lihua on 16/7/4.
 */
'use strict';
var kmap = require('../kmap');
var $ = require('jquery');
var bootbox = require('bootbox');
var instanceDataForm = require('../../lib/instanceTaskForm');

$(function(){
    kmap.buildMenu('task');
    var instanceElement;
    var names = {
        "regex":"正则",
        "seeds":"种子",
        "parser":"解析器",
        "mark":"标签",
        "description":"描述",
        "depth":"深度",
        "listregex":"列表页正则",
        "listcycle":"列表页周期",
        "spiderFreq":"抓取频率",
        "pageLoadMaxWait":"抓取时长",
        "bufferCount":"缓存数量",
        "cycle":"周期",
        "lastupdate":"时间",
        "taskLocked":"任务锁定",
        "loadImg":"加载图片"
    };
    var types = [1,1,7,1,3,6,3,0,0,0,0,0,2,4,4];//0 num, 1 textInput ,2 data, 3text ,4,radio,5,form,6 select
    var taskSchema = [];
    var keys = Object.keys(names);
    for(var i=0;i<keys.length;i++){
        var item = new Object();
        item.key = keys[i];
        item.name = names[item.key];
        item.type = types[i];
        taskSchema.push(item);
    }
    //var values = new Object();
    //values["depth"] = "1";
    //values["loadImg"] = false;
    //values["taskLocked"] = false;
    //values["listcycle"] = 7200;
    //values["pageLoadMaxWait"] = 200;
    //values["spiderFreq"] = 1;
    //values["cycle"] = 1;
    //values["bufferCount"] = 1;
    //var myDate = kmap.dateFormate(new Date(),'yyyy-MM-dd');
    //values["lastupdate"] =(myDate);
    instanceElement = instanceDataForm.mount({className:"addTask",schema: taskSchema}, document.getElementById('add-Task'));

    $('#add-taskData-button').on('click', function(){
        if (!instanceElement || !instanceElement.state || !instanceElement.state.value){
            return;
        }
        var data = instanceElement.state.value;
        var parses = $('#schemaTable').schemaTable('getValue');
        if(parses.error){
            return;
        }
        data.parser = parses;
        console.dir(data);
        kmap.ajax({
            url: kmap.config.dataServer + '/recordservice/recordtable/' + '39bffc49-0bf8-40b9-8181-69ea93fa82ca' + '/record',
            type: 'POST',
            cache: false,
            contentType: 'application/json',
            data:JSON.stringify([{data:JSON.stringify(data)}]),
            dataType: 'text',
            success: function(){
                bootbox.alert('添加成功！', function() {
                    location.href = '/task/list-task';
                });
            },
            error: function(){
                bootbox.alert('添加失败！', function() {
                });
            }
        });
    });




});
