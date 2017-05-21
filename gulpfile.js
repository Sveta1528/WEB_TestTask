var gulp = require('gulp')

var stylus = require('gulp-stylus');
var browserSync = require('browser-sync');
var inlinesource = require('gulp-inline-source');
var concat = require('gulp-concat');

var del = require('del'); // Подключаем библиотеку для удаления файлов и папок
var imagemin     = require('gulp-imagemin');
var pngquant     = require('imagemin-pngquant');
var cache        = require('gulp-cache');
var htmlmin      = require('gulp-htmlmin');
var cleanCSS     = require('gulp-clean-css');


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

gulp.task('webserver', function () {
    browserSync(config);
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
        .pipe(gulp.dest('app/buildjs'))
});

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('html', function() {
  return gulp.src('app/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify-css', function() {
  return gulp.src('app/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
        ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('build', ['clean','stylus-to-css','minify-css','img','html'], function() {

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))
    var buildFonts = gulp.src('app/js/**/*.js') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/js'))
});

gulp.task('watch', ['stylus-to-css'], function() {
    gulp.watch('app/stylus/**/*.styl', ['stylus-to-css']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    // Наблюдение за другими типами файлов
});

gulp.task('default', ['watch','webserver']);
