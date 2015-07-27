'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

module.exports = function(options) {
  gulp.task('styles', function () {
    var lessOptions = {
      options: [
        'bower_components',
        options.src + '/app',
        options.src + '/components'
      ]
    };

    var injectFiles = gulp.src([
      options.src + '/{app,components}/**/*.less',
      '!' + options.src + '/app/index.less',
      '!' + options.src + '/app/vendor.less'
    ], { read: false });

    var injectOptions = {
      transform: function(filePath) {
        filePath = filePath.replace(options.src + '/app/', '');
        filePath = filePath.replace(options.src + '/components/', '../components/');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    };

    var indexFilter = $.filter('index.less');

    return gulp.src([
      options.src + '/app/index.less',
      options.src + '/app/vendor.less'
    ])
    .pipe(indexFilter)
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(indexFilter.restore())
    .pipe($.sourcemaps.init())
    .pipe($.less(lessOptions)).on('error', options.errorHandler('Less'))
    .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(options.tmp + '/serve/app/'))
    .pipe(browserSync.reload({ stream: true }));
  });
};
