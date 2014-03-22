angular.module('riseApp.controllers').controller("SubmitCtrl", function($scope, $firebase, scService) {

	var songsRef = new Firebase("https://shining-fire-6877.firebaseio.com/songs");
	$scope.allSongs = $firebase(songsRef);

	$scope.submit = function(newsong) {

		// resolve song url with soudcloud api
		// $.getJSON('http://api.soundcloud.com/resolve.json?url=' + newsong.url + '&client_id=e886c21459d731e8ac7aeedcb3c3b4bb',
		// 	function(res){ console.log('resolved track:', res); }
		// );
	
	// try and resolve track with soundcloud api (using angular service deferred promise result)
	var trackPromise = scService.resolve(newsong.url);
	console.log(trackPromise);
	// wait on promise to return 
    trackPromise.then(function(resolvedSong) {
       	//$scope.resolvedSong = resolvedSong;
		
		console.log('submit ctrl sc resolve track: ');
		console.log('   title: ',resolvedSong.title, 'duration: ', resolvedSong.duration);
		console.log('   username: ', newsong.submitter);
    },
    function(e) {
    	console.log(e);
    	alert('That url was not a valid track');
    }); // trackPromise handlers end

		
	};
	
});

