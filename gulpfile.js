const gulp = require('gulp');
const webpack = require('webpack-stream');
const stripDebug = require('gulp-strip-debug');

gulp.task('build', function () {
	return gulp
		.src('index.ts')
		.pipe(webpack(require('./webpack.config')))
		.pipe(stripDebug())
		.pipe(gulp.dest('./'));
});
