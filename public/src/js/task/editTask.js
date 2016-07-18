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
    var orgData="";
    var keys = Object.keys(names);
    for(var i=0;i<keys.length;i++){
        var item = new Object();
        item.key = keys[i];
        item.name = names[item.key];
        item.type = types[i];
        if(names[i] == "任务锁定") item.nameType = "taskLocked";
        if(names[i] == "加载图片") item.nameType = "loadImage";
        taskSchema.push(item);
    }
    kmap.ajax({
        url: kmap.config.dataServer + '/taskservice/task/' + kmap.getQueryString('taskId'),
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function(data2){
            //console.dir(data2);
            if(data2){
                 orgData = kmap.dateFormate(new Date(data2.lastupdate),'yyyy-MM-dd');
                instanceElement = instanceDataForm.mount({className:"editTask",schema: taskSchema, data:data2}, document.getElementById('editModal-body'));
            }
        },
        error: function(){
            bootbox.alert('查询数据失败！', function() {});
        }
    });

    //instanceElement = instanceDataForm.mount({schema: taskSchema}, document.getElementById('editModal-body'));

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
        data.taskId = kmap.getQueryString('taskId');
        if(data.lastupdate == orgData){

            data.lastupdate = kmap.dateFormate(new Date(),'yyyy-MM-dd');
        }

        console.dir(kmap.config.dataServer + '/recordservice/recordtable/' + '39bffc49-0bf8-40b9-8181-69ea93fa82ca' + '/record');
        kmap.ajax({
            url: kmap.config.dataServer + '/recordservice/recordtable/' + '39bffc49-0bf8-40b9-8181-69ea93fa82ca' + '/record',
            type: 'POST',
            contentType: 'application/json',
            cache: false,
            data:JSON.stringify([{data:JSON.stringify(data)}]),
            dataType: 'text',
            success: function(){
                bootbox.alert('修改成功！', function() {
                    location.href = '/task/list-task';
                });
            },
            error: function(){
                bootbox.alert('修改失败！', function() {
                });
            }
        });
    });




});
