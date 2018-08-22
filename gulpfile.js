const gulp = require('gulp');
const del = require('del');
const lazypipe = require('lazypipe');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const header = require('gulp-header');
const package = require('./package.json');

// Scripts
const uglify = require('gulp-uglify');

// Styles
const sass = require('gulp-sass');
const minify = require('gulp-clean-css');

var paths = {
  input: 'src/**/*',
  output: 'dist/',
  scripts: {
    input: 'src/js/*',
    output: 'dist/js/'
  },
  styles: {
    input: 'src/sass/**/*.{scss,sass}',
    output: 'dist/css/'
  }
}

var banner = {
  full:
    '/*!\n' +
    ' * <%= package.name %> - <%= package.description %>\n' +
    ' * Author: <%= package.author.name %> <<%= package.author.email %>>\n' +
    ' * Version: v<%= package.version %>\n' +
    ' * Url: <%= package.repository.url %>\n' +
    ' * License: <%= package.license %>\n' +
    ' */\n\n',
  min:
    '/*!' +
    ' <%= package.name %> v<%= package.version %>' +
    ' | <%= package.author.name %> <<%= package.author.email %>>' +
    ' | <%= package.license %> License' +
    ' | <%= package.repository.url %>' +
    ' */\n'
};

gulp.task('clean', function () {
  del.sync([paths.output]);
});

gulp.task('build:scripts', function () {
  const jsTasks = lazypipe()
    .pipe(header, banner.full, { package: package })
    .pipe(gulp.dest, paths.scripts.output)
    .pipe(rename, { suffix: '.min' })
    .pipe(uglify)
    .pipe(header, banner.min, { package: package })
    .pipe(gulp.dest, paths.scripts.output)

  return gulp.src(paths.scripts.input)
    .pipe(plumber())
    .pipe(jsTasks());
});

gulp.task('build:styles', function () {
  return gulp.src(paths.styles.input)
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded',
      sourceComments: true
    }))
    .pipe(header(banner.full, { package: package }))
    .pipe(gulp.dest(paths.styles.output))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minify({ level: { 1: { specialComments: 0 } } }))
    .pipe(header(banner.min, { package: package }))
    .pipe(gulp.dest(paths.styles.output));
});

gulp.task('watch', function () {
  gulp.watch(paths.input).on('change', function () {
    gulp.start('default');
  });
});

gulp.task('build', ['build:scripts', 'build:styles'])

gulp.task('default', ['clean', 'build']);