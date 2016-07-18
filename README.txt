首次运行
1.安装依赖
>> npm install
2.编译压缩js代码（没有安装gulp和webpack的需要安装gulp和webpack, npm install -g gulp webpack）
>> gulp
3.启动
>> npm start




webpack命令
$ webpack    //默认运行webpack.config.js
$ webpack --display-error-details    //显示详细错误信息，方便定位
$ webpack --config XXX.js   //使用另一份配置文件（比如webpack.config2.js）来打包
$ webpack --watch   //监听变动并自动打包
$ webpack -p    //压缩混淆脚本，这个非常非常重要！
$ webpack -d    //生成map映射文件，告知哪些模块被最终打包到哪里了
$ webpack --progress --colors --watch;