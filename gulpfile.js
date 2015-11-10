var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browser = require('browser-sync');
var notify = require('gulp-notify');
var cp = require('child_process');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jekyll = process.platform === "win32" ? "jekyll.bat" : "jekyll";

gulp.task('sass', function() {
    return gulp.src('source/_sass/*.scss')
    .pipe(
        sass({
            outputStyle: 'nested'
        })
    )
    .pipe(
        gutil.env.sourcemaps ? sourcemaps.init() : gutil.noop()
    )
    .pipe(
        sass({
            outputStyle: gutil.env.production ? 'compressed' : 'nested'
        })
    )
    .pipe(
        gulp.dest('site/assets/css')
    )
    .pipe(
    	browser.stream()
    );
});

gulp.task('jsHint', function() {
    browser.notify("Running JS Hinting");
    return gulp.src(['source/_js/*.js', '!source/_js/libs/**/*.js'])
    .pipe(
        jshint()
    )
    .pipe(
        jshint.reporter('jshint-stylish')
    );
});

gulp.task('jsMinify', ['jsHint'], function() {
    browser.notify("Running JS Minify");
    return gulp.src(['source/_js/*.js'], {base: "./source/_js/"})
    .pipe(
        gutil.env.production ? uglify() : gutil.noop()
    )
    .pipe(rename({
        suffix: ".min",
    }))
    .pipe(
        gulp.dest('site/assets/js')
    );
});

// Combine JS files
gulp.task('js', ['jsMinify'], function() {
    browser.notify("Running JS Concat");
    var base = gulp.src(['source/_js/libs/jquery-1.11.3.js', 'source/_js/libs/bootstrap.js', 'site/assets/js/main.min.js'])
    .pipe(
        concat('main.min.js')
    )
    .pipe(
        gulp.dest('site/assets/js')
    );
    var angular = gulp.src(['source/_js/libs/angular.js'])
    .pipe(
        concat('angular.min.js')
    )
    .pipe(
        gulp.dest('site/assets/js')
    );
    browser.reload();
    return merge(base, angular);
});

gulp.task('jekyll', function (done){
	browser.notify("jekyll build");
	cp.spawn(jekyll, ['build'], {stdio: 'inherit'}).on('close', done);
});

gulp.task('jekyll-reload', ['jekyll'], function (){
	browser.reload();
});

gulp.task('browsersync', function() {
    browser.init({
        server: {
            baseDir: "site",
            https: false
        },
        open: false,
        port: "8000"
    });
});

gulp.task('watch', function() {
	gulp.watch(['source/_html/**/*.html','!site/*.html']).on('change', function(file) {
		gulp.start('jekyll-reload');
	});

	gulp.watch('source/_sass/**/*.scss').on('change', function(file) {
		gulp.start('sass');
	});

    gulp.watch('source/_js/**/*.js').on('change', function(file) {
        gulp.start('js');
    });

	gulp.start('browsersync');
});

gulp.task('default', function() {
	gulp.start('sass');
});