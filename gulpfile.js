'use strict';

var project = require('./package.json');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ pattern: '*' });
var _ = require('lodash');

// Convert 'generator-boombox' into 'GeneratorBoombox'.
project.mainClass = _.capitalize(_.camelCase(project.name));

project.banner = _.template('/* <%= name %> v<%= version %>, ' +
  'license <%= license %> */\n')(project);

// Workaround: gulp-jsdoc doesn't support global functions.
gulp.task('docs', $.shell.task('node_modules/jsdoc/jsdoc.js' +
  ' -d build/docs -r src/scripts'));

gulp.task('scripts', function() {
  return gulp.src('src/scripts/main.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
      .pipe($.browserify({ standalone: project.mainClass }))
      .pipe($.rename(project.name + '.js'))
      .pipe(gulp.dest('build/scripts'))
      .pipe($.uglify())
      .pipe($.header(project.banner))
      .pipe($.rename(project.name + '.min.js'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('build/scripts'));
});

gulp.task('styles', function() {
  return gulp.src('src/styles/main.less')
    .pipe($.plumber({
      // Workaround: gulp-plumber can't handle gulp-less error properly.
      errorHandler: function(error) {
        $.util.log(
          $.util.colors.cyan('Plumber') +
            $.util.colors.red(' found unhandled error:\n'),
          error.toString()
        );
        this.emit('end');
      },
    }))
    .pipe($.sourcemaps.init())
      .pipe($.less())
      .pipe($.minifyCss())
      .pipe($.header(project.banner))
      .pipe($.rename(project.name + '.min.css'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('build/styles'));
});

gulp.task('templates', function() {
  return gulp.src('src/templates/**/*')
    .pipe($.plumber())
    .pipe($.jade({ data: { project: project } }))
    .pipe($.minifyHtml())
    .pipe(gulp.dest('build'));
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe($.plumber())
    .pipe($.imagemin())
    .pipe(gulp.dest('build/images'));
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('build/fonts'));
});

gulp.task('test', function() {
  return gulp.src('test/**/*')
    .pipe($.jasmine());
});

gulp.task('jslint', function() {
  return gulp.src(['gulpfile.js', 'src/scripts/**/*'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-reporter-jscs'))
    .pipe($.jshint.reporter('fail'))
    .pipe($.jscs());
});

gulp.task('jsonlint', function() {
  return gulp.src(['package.json', 'bower.json'])
    .pipe($.jsonlint())
    .pipe($.jsonlint.reporter());
});

gulp.task('clean', function() {
  $.del.sync('build');
});

gulp.task('watch', ['clean', 'build', 'connect'], function() {
  gulp.watch('src/scripts/**/*', ['scripts']);
  gulp.watch('src/styles/**/*', ['styles']);
  gulp.watch('src/templates/**/*', ['templates']);
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch('src/fonts/**/*', ['fonts']);
});

gulp.task('connect', function() {
  $.connect.server({ root: 'build' });
});

gulp.task('lint', ['jsonlint', 'jslint']);
gulp.task('build', ['fonts', 'images', 'templates', 'styles', 'scripts']);
gulp.task('default', ['clean', 'lint', 'test', 'build', 'docs']);
