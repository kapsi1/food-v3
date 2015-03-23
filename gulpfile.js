var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    del = require('del'),
    concat = require('gulp-concat'),
    server = require('gulp-express'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    merge = require('merge-stream'),
    inject = require('gulp-inject'),
    plumber = require('gulp-plumber');

gulp.task('less', function () {
    return gulp.src('client/**/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(plumber.stop())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('client'));
});

gulp.task('watch', function () {
    gulp.watch('client/**/*.less', ['less']);
});

gulp.task('clean', function (cb) {
    del(['./dist/*', '!.git'], cb);
});

gulp.task('build:jspm', ['clean'], function (cb) {
    var jspm = require('jspm'),
        mkdirp = require('mkdirp');
    mkdirp('dist/client/', function (err) {
        if (err) console.error(err);
        else {
            jspm.setPackagePath('.');
            jspm.bundleSFX('main', 'dist/client/build.js', {mangle: false}).then(function () {
                cb();
            });
        }
    });
});
gulp.task('build:uglify', ['build:jspm'], function () {
    return gulp.src('dist/client/build.js')
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/client'));
});
gulp.task('build:less', ['clean'], function () {
    return gulp.src('./client/**/*.less')
        .pipe(less())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./dist/client'));
});
gulp.task('build:copy', ['clean'], function () {
    var removeCode = require('gulp-remove-code');
    return merge(
        gulp.src(['./client/**/*.html'])
            .pipe(removeCode({production: true}))
            .pipe(gulp.dest('./dist/client')),
        gulp.src(['./server/**/*']).pipe(gulp.dest('./dist/server')),
        gulp.src(['./jspm_packages/**/*']).pipe(gulp.dest('./dist/jspm_packages')),
        gulp.src(['package.json']).pipe(gulp.dest('./dist')),
        gulp.src(['service-worker2.js']).pipe(gulp.dest('./dist/client'))
    )
});
gulp.task('build:inject', ['build:copy', 'build:jspm', 'build:less', 'generate-service-worker'], function () {
    var target = gulp.src('./dist/client/index.html'),
        sources = gulp.src(['./dist/client/*.js', './dist/client/build.css'], {read: false});

    return target.pipe(inject(sources, {relative: true}))
        .pipe(gulp.dest('./dist/client'));
});

gulp.task('generate-service-worker', ['build:copy', 'build:uglify', 'build:less'], function (callback) {
    var fs = require('fs');
    var swPrecache = require('sw-precache');
    var rootDir = 'dist/client';

    swPrecache({
        staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif}'],
        stripPrefix: rootDir
    }, function (error, swFileContents) {
        if (error) {
            return callback(error);
        }
        fs.writeFile(path.join(rootDir, 'service-worker.js'), swFileContents, callback);
    });
});

gulp.task('build', ['clean', 'build:jspm', 'build:less', 'build:copy', 'build:inject']);

gulp.task('serve:dist', function () {
    server.run(['dist/server/app.js']);
});
gulp.task('serve', ['less', 'watch'], function () {
    server.run(['server/app.js']);
});