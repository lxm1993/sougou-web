/**
 * Created by lihua on 2016/4/7.
 */

var gulp = require('gulp');
var webpack = require('webpack');
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglify');


gulp.task('webpack', function(callback) {
    var webpackConfig = require('./webpack.config.js');
    webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );
    webpack(
        webpackConfig
        , function(err, stats) {
            // if(err) throw new gutil.PluginError("webpack", err);
            // gutil.log("[webpack]", stats.toString({
            //     // output options
            // }));
            callback();
        });
});

gulp.task('default',['webpack'], function(){
    console.log('default task success');
});
//自动检测文件变化并刷新界面(liuxiaomin)
gulp.task('watch',['default'], function () {    // 这里的watch，是自定义的，写成live或者别的也行
    livereload.listen();
    gulp.watch('views/**/*.*',function(file){
        //console.log(file.path);
        gulp.src(file.path)
            .pipe(livereload());
    });

});
//gulp.watch('public/src/js/**',function(file){
//    console.log(file);
//    gulp.src('views/**/*.*')
//        .pipe(livereload());
//});
//gulp.task('viewReload',function(file){
//    console.log(file);
//    //gulp.src('views/**/*.*')
//    //    .pipe(livereload());
//});
//gulp.watch('public/src/js/**',function(file){
//    console.log(file.path);
//    gulp.src(file.path)
//        .pipe(uglify())
//        .pipe(gulp.dest('public/dist'))
//        .pipe(livereload());
//
//});