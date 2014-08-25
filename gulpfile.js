var gulp = require('gulp');
var util = require('gulp-util');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var htmlReplace = require('gulp-html-replace');


var BUILD = 'build';
var VENDORFILE = 'libs.js';
var JSFILE = 'bundle.js';
var CSSFILE = 'styles.css';


gulp.task('clean', function() {
	return gulp.src(BUILD, {read:false})
		.pipe(clean({force:true}))
		.pipe(gulp.src('index.html', {read:false}))
		.pipe(clean({force:true}))
		.pipe(gulp.src('images', {read:false}))
		.pipe(clean({force:true}))
		.pipe(gulp.src('templates', {read:false}))
		.pipe(clean({force:true}));
});

gulp.task('css', function() {
	var outdir = 'css';
	watch({ glob: 'client/scss/*.scss' })
		.pipe(sass())
		.pipe(gulp.dest('client/css'));
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
		'client/js/lib/jquery.js',
		'client/js/lib/firebase.js',
		'client/js/lib/underscore.js',
		'client/js/lib/*.js'
	])
		.pipe(concat(VENDORFILE))
		.pipe(gulp.dest(BUILD));
});


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

gulp.task('images', function() {
	return gulp.src('client/images/*')
		.pipe(gulp.dest('./images'));
});

gulp.task('templates', function() {
	return gulp.src('client/templates/*')
		.pipe(gulp.dest('./templates'));
});

gulp.task('replace', function() {
	return gulp.src('client/index.html')
		.pipe(htmlReplace({
			css: BUILD + '/' + CSSFILE,
			libs: BUILD + '/' + VENDORFILE,
			js: BUILD + '/' + JSFILE
		}))
		.pipe(gulp.dest('.'));
});

gulp.task('default', [
	'clean',
	'css'
], function() {
	connect.server({
		root: 'client'
	});
});

gulp.task('deploy', [
	'clean',
	'vendor',
	'js',
	'mincss',
	'replace',
	'images',
	'templates',
], function() {
	connect.server();
});
