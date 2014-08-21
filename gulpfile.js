var gulp = require('gulp');
var util = require('gulp-util');
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var htmlReplace = require('gulp-html-replace');


var BUILD = 'build';


gulp.task('clean', function() {
	gulp.src(BUILD, {read: false}).pipe(clean());
	gulp.src('images', {read: false}).pipe(clean());
	gulp.src('index.html', {read: false}).pipe(clean());
});

gulp.task('css', function() {
	var dir = 'client/scss/*.scss';
	var outdir = 'build/css';
	watch({ glob: dir })
		.pipe(sass())
		.pipe(gulp.dest(outdir));
});

gulp.task('mincss', ['css'], function() {
	return gulp.src([
		'client/css/reset.css',
		'client/css/bootstrap3.0.3.css',
		'client/css/autocomplete.css',
		'client/css/main.css'
	])
		.pipe(concat('styles.css'))
		.pipe(gulp.dest(BUILD));
});

gulp.task('vendor', function() {
	return gulp.src([
		'client/js/lib/angular.js',
		'client/js/lib/firebase.js',
		'client/js/lib/*.js'
	])
		.pipe(concat('libs.js'))
		.pipe(gulp.dest(BUILD));
});

var JSFILE = 'bundle.js';

gulp.task('js', function() {
	// now compile all of the JS, including the templates file
	return gulp.src([
		'client/js/app.js',
		'client/js/services/*.js',
		'client/js/controllers/*.js',
	])
		.pipe(concat(JSFILE))
		.pipe(gulp.dest(BUILD));
});

gulp.task('assets', function() {
	return gulp.src('client/images/*')
		.pipe(gulp.dest('images'));
});

gulp.task('replace', function() {
	return gulp.src('client/index.html')
		.pipe(htmlReplace({
			css: BUILD+'/styles.css',
			libs: BUILD+'/libs.js',
			js: BUILD+'/'+JSFILE
		}))
		.pipe(gulp.dest('.'));
});

gulp.task('server', function() {
	connect.server({
		livereload: true
	});
});

gulp.task('default', [
	'clean',
	'server',
	'css'
]);

gulp.task('deploy', [
	'clean',
	'vendor',
	'js',
	'mincss',
	'replace',
	'assets',
	'server'
]);
