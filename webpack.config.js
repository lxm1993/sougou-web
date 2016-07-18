/**
 * Created by lihua on 2016/4/6.
 */
var webpack = require('webpack');
module.exports = {
    //插件项
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'dist/common.js'),
        // new webpack.ProvidePlugin({
        //     React: "react",
        //     jQuery: "jquery"
        // })
    ],
    //页面入口文件配置
    entry: {
        'refreshToken' : './public/src/js/refreshToken',
        'task' : './public/src/js/task/task',
        'addTask' : './public/src/js/task/addTask',
        'editTask' : './public/src/js/task/editTask',
        'metaData' : './public/src/js/data/metaData',
        'addMetaData' : './public/src/js/data/addMetaData',
        'editMetaData' : './public/src/js/data/editMetaData',
        'instanceData': './public/src/js/data/instanceData',
        'addInstanceData': './public/src/js/data/addInstanceData',
        'editInstanceData': './public/src/js/data/editInstanceData',
        'listParser': './public/src/js/parser/listParser',
        'editParser': './public/src/js/parser/editParser',
        'diffParser': './public/src/js/parser/diffParser',
        'user': './public/src/js/user/user',
        'token': './public/src/js/token/token',
        vendor: [
            'react',
            'react-dom',
            'jquery',
            'underscore',
            'bootstrap',
            'bootbox',
            'bootstrapTable',
            'bootstrapTableZh'
        ]
    },
    //入口文件输出配置
    output: {
        path: 'public',
        filename: 'dist/[name].js'
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel',query: {presets: ['react']}},
            //{ test: /\.js$/, loader: 'jsx-loader?harmony' },
            //{ test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=8192'},
            {test: require.resolve('jquery'), loader: 'expose?jQuery'}
        ]
    },
    //其它解决方案配置
    resolve: {
        //查找module的话从这里开始查找
        root: __dirname, //绝对路径
        extensions: ['', '.js', '.jsx', '.css'],
        alias: {
            'jso':'public/vendor/jso/jso',

            'bootstrap':'public/vendor/bootstrap/core/js/bootstrap',
            'bootstrapTable':'public/vendor/bootstrap/table/bootstrap-table',
            'bootstrapTableZh':'public/vendor/bootstrap/table/bootstrap-table-zh-CN',
            'bootbox': 'public/vendor/bootstrap/bootbox/bootbox.min',

            'ace': 'public/vendor/ace-master/src-min-noconflict/ace',
            'ace-diff': 'public/vendor/ace-master/ace-diff/ace-diff',
            'diff-patch': 'public/vendor/ace-master/ace-diff/diff_match_patch'
        }
    }
};