//gulp
var gulp = require("gulp"),
    gulpSequence = require('gulp-sequence'),
    gutil = require("gulp-util"),
    del = require("del"),
    path = require('path'),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify"),
    postcss = require('gulp-postcss'),
    sass = require("gulp-sass"),
    autoprefixer = require("autoprefixer"),
    cssnano = require('cssnano'),
    newer = require("gulp-newer"),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin');
//browser-sync
var bs = require('browser-sync').create();

//清除
gulp.task('clean', function (cb) {
    del.sync('dist');
    cb();
});

//图片压缩
gulp.task('copyImg', function () {
    return gulp.src('src/pages/**/*.!(html|scss)')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/pages/'));
});

//复制无需编译的js文件
gulp.task('copyJs', function () {
    return gulp.src('./src/js/responsive.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

//复制html
gulp.task('copyHtml', function () {
    return gulp.src('src/pages/**/*.html')
        .pipe(gulp.dest('dist/pages/'));
});

//编译sass
gulp.task('dev:sass', function () {
    return gulp.src('src/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(postcss())
        .pipe(gulp.dest('dist/'))
        .pipe(bs.reload({ stream: true }));
});

//监听文件
gulp.task('server', function () {
    gulp.watch('src/pages/**/*.scss', ['dev:sass']);
    gulp.watch("src/pages/**/*.html", ['copyHtml']).on('change', bs.reload);
});

//browserSync
gulp.task('proxy-server', function () {
    bs.init({
        // startPath: "/dist/app.html",
        port: 3066,
        proxy: "http://localhost:3009"
    });
});

gulp.task('buildSuccess', function (cb) {
    gutil.log("[webpack:production]", "build success!");
    cb();
});

gulp.task('build', gulpSequence('clean', 'copyImg', 'copyJs', 'copyHtml', 'buildSuccess'));
gulp.task("dev", gulpSequence('clean', 'copyImg', 'copyJs', 'copyHtml', 'dev:sass', 'server', 'proxy-server'));
