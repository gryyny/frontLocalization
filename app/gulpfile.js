'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const gutil = require('gulp-util');
const i18n = require('gulp-html-i18n');
const nunjucksRender = require('gulp-nunjucks-render');

var reload = browserSync.reload;

var conf = {
    dest: 'dest',
    scss: 'src/sass/**/*.scss',
    css: 'dest/assets/css',
    templates: 'src/templates/*.html',
    langDir: 'src/lang',
    html: ['*.html', 'Views/**/*.cshtml', 'dest/**/*.html'],
    js: 'dest/assets/js/**/*.js'
};

gulp.task('serve', ['sass'], function () {

    browserSync.init({
        server: "./dest",
        port: 3018
    });

    // browserSync({
    //     startPath: "/",
    //     proxy: "localhost:17725"
    // });

    gulp.watch('src/templates/**/*.html', ['html']);
    gulp.watch(conf.scss, ['sass']);
    gulp.watch(conf.html).on('change', reload);
    gulp.watch(conf.js).on('change', reload);
});

gulp.task('html', function () {

    gulp.src(conf.templates)
        .pipe(nunjucksRender({
            path: 'src/templates'
        }))
        .pipe(i18n({
            delimiters: ['{','}'],
            langDir: conf.langDir,
            createLangDirs: true,
            defaultLang: 'ru',
            trace: false
        }))
        .pipe(gulp.dest(conf.dest));
});

// Compile sass into CSS
gulp.task('sass', function () {
    var s = sass.sync({
        outputStyle: 'compact'
    });
    s.on('error', function (e) {
        gutil.log(e);
        s.end();
    });
    return gulp.src(conf.scss)
        .pipe(s)
        .pipe(autoprefixer({
            browsers: ['last 50 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(conf.css))
        .pipe(browserSync.stream());
});
gulp.task('default', ['html','serve']);
