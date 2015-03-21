var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    del = require('del'),
    concat = require('gulp-concat'),
    babel = require("gulp-babel");

gulp.task('less', function () {
    return gulp.src('./client/**/*.less')
        .pipe(less())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./client'));
});

gulp.task('watch', function () {
    gulp.watch('./client/**/*.less', ['less']);
});

gulp.task('clean', function () {
    del('dist');
});

gulp.task('build:babel', ['clean'], function () {
    return gulp.src('./client/**/*.js')
        .pipe(babel())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist/client'));
});
gulp.task('build:less', ['clean'], function () {
    return gulp.src('./client/**/*.less')
        .pipe(less())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./dist/client'));

});
gulp.task('build:copy:server', ['clean'], function () {
    return gulp.src(['server/**/*']).pipe(gulp.dest('dist/server'));
});
gulp.task('build:copy:html', ['clean'], function () {
    return gulp.src(['./client/**/*.html']).pipe(gulp.dest('./dist/client'));
});

gulp.task('build', ['build:babel', 'build:less', 'build:copy:server', 'build:copy:html']);