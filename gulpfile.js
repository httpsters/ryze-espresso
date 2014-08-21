var gulp = require('gulp');
var util = require('gulp-util');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var htmlreplace = require('gulp-html-replace');

var BUILD = './build';


gulp.task('css', function() {
	var dir = './scss/*.scss';
	var outdir = './css';
	return watch({ glob: dir })
		.pipe(sass())
		.pipe(gulp.dest(outdir));
});

gulp.task('vendor', function() {
	return gulp.src('js/lib/*.js')
		.pipe(concat('lib.js'))
		.pipe(gulp.dest(BUILD));
});

gulp.task('replace', function() {
	gulp.src('index.html')
		.pipe(htmlreplace({
			css: 'build/styles.css',
			libs: 'build/libs.js',
			js: 'build/app.js'
		}))
		.pipe(gulp.dest(BUILD));
});

gulp.task('server', function() {
	connect.server({
		livereload: true
	});
});

gulp.task('default', ['server', 'css']);

gulp.task('deploy', ['vendor', 'replace']);
