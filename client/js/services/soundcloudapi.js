angular.module('riseApp.services').factory('scService', function ($http, $q) {
	return {
		// query soundcloud api to resolve track by url
		// returns track metadata object
	    resolve: function (trackUrl) {
	        var deferred = $q.defer();

	        $http({
	        	method:"GET", 
	        	url:'http://api.soundcloud.com/resolve.json?url=' + trackUrl + '&client_id=e886c21459d731e8ac7aeedcb3c3b4bb'
	    	})
	    	.success(
	    		function (result) {
	    			deferred.resolve(result);
	    		}
			);

	        return deferred.promise;
	    } // end resolve fn
	} //end scService factory

}); // end resolve track factory