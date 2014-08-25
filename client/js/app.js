// on production, remove the /dev
// while developing, use the /dev
var firebaseRoot = "https://shining-fire-6877.firebaseio.com/dev";

var riseApp = angular.module('riseApp', [
	'ngRoute',
	'riseApp.services',
    'riseApp.controllers',
    'firebase',
	'autocomplete'
]);

riseApp.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'templates/app.html'
		})
		.when('/admin', {
			templateUrl: 'templates/admin.html'
		})
		.otherwise({
			redirectTo: '/'
		});
});

riseApp.filter('toDate', function() {
	return function(timestamp) {
		var date = new Date(timestamp);
		return date.toLocaleString();
	};
});

angular.module('riseApp.services', []);
angular.module('riseApp.controllers', []);
