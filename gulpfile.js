var gulp = require('gulp')

var stylus = require('gulp-stylus');
var browserSync = require('browser-sync');
var inlinesource = require('gulp-inline-source');
var concat = require('gulp-concat');

// js
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var iife = require("gulp-iife");
var uglify = require('gulp-uglify');


var config = {
    server: {
        baseDir: "app"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
};


gulp.task('stylus-to-css', function(){
    return gulp.src('app/stylus/**/*.styl')
        .pipe(stylus())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./app/css'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(gulp.dest('./dist/css'))
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: "./app"
    },
    port: 8080,
    open: true,
    notify: false
  });
});

gulp.task('lint', () => {
    return gulp.src('app/js/**/*')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('jsbuild', function () {
    return gulp.src('app/js/**/*')
        .pipe(concat('main.js'))
        .pipe(iife())
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify())
        .pipe(gulp.dest('app/mainjs'))
});


gulp.task('watch', ['stylus-to-css'], function() {
    gulp.watch('app/stylus/**/*.styl', ['stylus-to-css']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    // Наблюдение за другими типами файлов
});

gulp.task('default', ['watch','browserSync']);
