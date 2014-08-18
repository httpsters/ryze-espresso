angular.module('riseApp.controllers').controller("SubmitCtrl", function($scope, $firebase, $http, $timeout, scResolve) {
	var songsRef = new Firebase(firebaseRoot + "/songs");
	var userSongsRef = new Firebase(firebaseRoot + "/queue/next");
	$scope.allSongs = $firebase(songsRef);
	$scope.userSongs = $firebase(userSongsRef);

	$scope.tracksSearch = function(query) {
		return $http.jsonp("http://api.soundcloud.com/tracks.json?q="+query+"&limit=10&client_id=e886c21459d731e8ac7aeedcb3c3b4bb").then(function(response){
			console.debug('submitctrl search response: ',response.data);
			return response.data;
		});
	};

	$scope.confShowing = false;
	$scope.toggle = function(){
		$scope.confShowing = !($scope.confShowing);
	}
	$scope.showConf = function() {
		$scope.toggle();
		$timeout($scope.toggle, 4000);
	}
	$scope.submit = function(newsong) {
		if(newsong) {
			// try and resolve track with soundcloud api
			// (using angular service deferred promise result)
			var trackPromise = scResolve.resolve(newsong.url);
			console.debug(trackPromise);
			// wait on promise to return 
			trackPromise.then(function(resolvedSong) {
				console.debug("resolved song is", resolvedSong);
				console.debug('submit ctrl adding resolved track: ');
				console.debug('   title: ',resolvedSong.title, 'duration: ', resolvedSong.duration);
				console.debug('   username: ', newsong.submitter);

				var song = {
					time_added: new Date().getTime(),
					added_by: newsong.submitter,
					likes: 1,
					last_liked: new Date().getTime(),
					duration: resolvedSong.duration,
					title: resolvedSong.title,
					play_count: 0,
					url: resolvedSong.permalink_url,
					last_played: 0,
				}

				$scope.allSongs.$add(song).then(function(ref) {
					// add id of new song to user song queue
					addSongRef = {
						'key': ref.name(),
						'time_added': new Date().getTime()
					};
					$scope.userSongs.$add(addSongRef);
					$scope.showConf();
				});

			},
			function(e) {
				console.debug(e);
				alert('That url was not a valid track');
			}
							 ); // trackPromise handlers end


		}}; //$scop.submit defn end

});

