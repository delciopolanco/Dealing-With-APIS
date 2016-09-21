var gulp = require('gulp'),
    server = require('gulp-server-livereload'),
    handlebars = require('gulp-handlebars'),
    declare = require('gulp-declare'),
    wrap = require('gulp-wrap'),
    concat = require('gulp-concat');

var config = {
    srcTemplates: './app/templates/**/*',
    destTemplates: './app/libs/'
};


/**
 * Run livereload server
 */
gulp.task('webserver', function () {
    gulp.src('./app/')
        .pipe(server({
            open: true,
            livereload: {
                defaultFile: 'index.html'
            }
        }));
});

/**
 * Compiles all handlebars files
 */
gulp.task('templates', function () {
    return gulp.src(config.srcTemplates)
        .pipe(handlebars({
            handlebars: require('handlebars')
        }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'Handlebars.templates',
            noRedeclare: true, // Avoid duplicate declarations 
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest(config.destTemplates));
});

/**
 * Watchers
 */
gulp.task('watch', function () {
    gulp.watch(config.srcTemplates, ['templates']);
});

gulp.task('default', ['templates', 'webserver', 'watch']);
