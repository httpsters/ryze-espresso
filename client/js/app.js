// on production, remove the /dev
// while developing, use the /dev
var firebaseRoot = "https://shining-fire-6877.firebaseio.com/dev";

var riseApp = angular.module("riseApp", [
	'riseApp.services',
    'riseApp.controllers',
    'firebase',
	'autocomplete'
]);

angular.module('riseApp.services', []);
angular.module('riseApp.controllers', []);
