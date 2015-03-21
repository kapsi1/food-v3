var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    del = require('del'),
    concat = require('gulp-concat'),
    server = require('gulp-express'),
    babel = require("gulp-babel"),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify');

gulp.task('less', function () {
    return gulp.src('./client/**/*.less')
        .pipe(less())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./client'));
});

gulp.task('watch', function () {
    gulp.watch('./client/**/*.less', ['less']);
});

gulp.task('clean', function (cb) {
    del('./dist', cb);
});

var jspm = require('jspm');
gulp.task('build:jspm', ['clean', 'build:copy:html'], function (cb) {
    jspm.setPackagePath('.');
    jspm.bundleSFX('main', 'dist/client/build.js', {mangle: false}).then(function () {
        console.log('jspm finished');
        cb();
    });
});
gulp.task('build:less', ['clean'], function () {
    return gulp.src('./client/**/*.less')
        .pipe(less())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./dist/client'));

});
gulp.task('build:copy:server', ['clean'], function () {
    return gulp.src(['./server/**/*']).pipe(gulp.dest('./dist/server'));
});
gulp.task('build:copy:html', ['clean'], function () {
    return gulp.src(['./client/**/*.html']).pipe(gulp.dest('./dist/client'));
});
gulp.task('build:copy:jspm', ['clean'], function () {
    return gulp.src(['./jspm_packages/**/*']).pipe(gulp.dest('./dist/jspm_packages'));
});
gulp.task('build', ['clean', 'less', 'build:jspm', 'build:less', 'build:copy:server', 'build:copy:html', 'build:copy:jspm'], function(){
    gulp.src('dist/client/build.js')
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('dist/client'));
});

gulp.task('serve:dist', function () {
    process.chdir('dist/server');
    server.run(['app.js']);
});
gulp.task('serve', function () {
    process.chdir('server');
    server.run(['app.js']);
});