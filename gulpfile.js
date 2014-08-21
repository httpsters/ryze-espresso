var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var watch = require('gulp-watch');


gulp.task('css', function() {
	var dir = './scss/*.scss';
	var outdir = './css';
	watch({ glob: dir })
		.pipe(sass())
		.pipe(gulp.dest(outdir));
});

gulp.task('server', function() {
	connect.server({
		livereload: true
	});
});

gulp.task('default', ['server', 'css']);
