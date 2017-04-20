var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var plumber = require('gulp-plumber');
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var merge =
// var format = require('gulp-jsbeautifier');
// var removeEmptyLines = require('gulp-remove-empty-lines');
// var minifyInline = require('gulp-minify-inline');
// var legacyIeCssLint = require('gulp-legacy-ie-css-lint');

gulp.task('develop', function() {
    gulp.watch(['source/_sass/**/*']).on('change', function(file) {
        gulp.start('compile-sass');
    });

    gulp.watch('source/_js/**/*').on('change', function(file) {
        gulp.start('concat-js');
    });
});

gulp.task('compile-sass', function() {
    return gulp.src(['source/_sass/**/*.scss'])
    .pipe(
        plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        })
    )
    .pipe(
        sourcemaps.init()
    )
    .pipe(
        sass({
            outputStyle: 'nested'
        })
    )
    .pipe(
        sourcemaps.write('sourcemaps')
    )
    .pipe(
        gulp.dest('build/assets/css')
    );
});

gulp.task('concat-js', function() {
    var core = gulp.src([
        'source/_js/lib/modernizr-custom.js',
        'source/_js/lib/jquery-3.2.1.js',
        'source/_js/core.js']
    )
    .pipe(
        concat('core.min.js')
    )
    .pipe(
        gulp.dest('build/assets/js')
    );
    return core;
});

var htmlbeautify = require('gulp-html-beautify');

gulp.task('clean-html', function() {
    return gulp.src(['build/pages/**/*.html'])
    .pipe(
        htmlbeautify({
            "indent_size": 4,
            "indent_char": " ",
            "eol": "\n",
            "indent_level": 0,
            "indent_with_tabs": false,
            "preserve_newlines": true,
            "max_preserve_newlines": 1,
            "jslint_happy": false,
            "space_after_anon_function": false,
            "brace_style": "collapse",
            "keep_array_indentation": true,
            "keep_function_indentation": true,
            "space_before_conditional": true,
            "break_chained_methods": false,
            "eval_code": false,
            "unescape_strings": false,
            "wrap_line_length": 0,
            "wrap_attributes": "auto",
            "wrap_attributes_indent_size": 4,
            "end_with_newline": true
        })
    )
    .pipe(
        gulp.dest('build/pages')
    );
});