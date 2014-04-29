// on production, remove the /dev
// while developing, use the /dev
var firebaseRoot = "https://shining-fire-6877.firebaseio.com/dev";

var riseApp = angular.module("riseApp", [
	'riseApp.services',
    'riseApp.controllers',
    'firebase']);
angular.module('riseApp.services', []);
angular.module('riseApp.controllers', []);
// check out the angular seed template for more help with templates, 
// routes, directives and stuff
// https://github.com/angular/angular-seed/blob/master/app/js/app.js 
