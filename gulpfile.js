// For more information on how to configure a task runner, please visit:
// https://github.com/gulpjs/gulp

var gulp    = require('gulp');
var clean   = require('gulp-clean');
var concat  = require('gulp-concat');
var rename  = require('gulp-rename');
var jshint  = require('gulp-jshint');
var uglify  = require('gulp-uglifyjs');
var sass    = require('gulp-sass');
var csso    = require('gulp-csso');

var es      = require('event-stream');
var browserify = require('gulp-browserify');
var sprite = require('css-sprite').stream;

// Clean the destination folder
gulp.task('clean', function () {
  gulp.src('dist/**/*.*', { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('copy-html', function () {
  return gulp.src('./src/**/*.html', { base: './src' })
      .pipe(gulp.dest('./dist'));

});

// Copy all application files except *.scss and .js into the `dist` folder
gulp.task('copy', ['copy-html'], function () {
  return es.concat(
    gulp.src(['src/scss/fontello/**'])
      .pipe(gulp.dest('dist/css/fontello')),
    gulp.src(['src/scss/opensans/**'])
      .pipe(gulp.dest('dist/css/opensans')),
    gulp.src(['src/img/**'])
      .pipe(gulp.dest('dist/img')),
    gulp.src(['src/js/vendor/**'])
      .pipe(gulp.dest('dist/js/vendor')),
    gulp.src(['src/*.*', 'src/CNAME'])
      .pipe(gulp.dest('dist'))
  );
});

// Detect errors and potential problems in your JavaScript code
// JSHint options can be modified in the .jshintrc file
gulp.task('scripts', function () {
  return es.concat(
    gulp.src(['src/js/**/*.js', '!src/js/vendor/**'])
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter(require('jshint-stylish'))),

    // Concatenate, minify and copy all JavaScript (except vendor scripts)
    gulp.src(['src/js/app.js', 'src/js/options.js'])
      .pipe(browserify({
        insertGlobals: true,
        debug: false // true
      }))/*
      .pipe(uglify({
        outSourceMap: true,
        basePath: '/js/'
      }))*/
      .pipe(gulp.dest('./dist/js')) // pipe it to the output DIR
  );
});

gulp.task('styles', function () {
  return gulp.src('src/scss/app.scss')
      .pipe(sass())
      .pipe(rename('app.css'))
      .pipe(csso())
      .pipe(gulp.dest('dist/css'))
});

gulp.task('watch', function () {
  // Watch .js files and run tasks if they change
  gulp.watch('src/js/**/*.js', ['scripts']);

  // Watch .less files and run tasks if they change
  gulp.watch('src/scss/**/*.scss', ['styles']);

  // Watch .html files
  gulp.watch('./src/**/*.html', ['copy-html']);
});

// The dist task (used to store all files that will go to the server)
gulp.task('dist', ['clean', 'copy', 'scripts', 'styles']);

// The default task (called when you run `gulp`)
gulp.task('default', ['dist', 'watch']);
