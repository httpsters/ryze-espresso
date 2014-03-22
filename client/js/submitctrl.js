angular.module('riseApp.controllers').controller("SubmitCtrl", function($scope, $firebase) {
	var songsRef = new Firebase("https://shining-fire-6877.firebaseio.com/songs");
	$scope.allSongs = $firebase(songsRef);
	$scope.trackUrl = "https://soundcloud.com/ministryofsound/r-b-mixtape-minimix"
	$.getJSON('http://api.soundcloud.com/resolve.json?url=' + $scope.trackUrl + '&client_id=e886c21459d731e8ac7aeedcb3c3b4bb',
				function(remoteData){
					$scope.result = remoteData;
					console.log(remoteData)
				}
	)
});

