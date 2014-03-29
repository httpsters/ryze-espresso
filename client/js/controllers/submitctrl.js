angular.module('riseApp.controllers').controller("SubmitCtrl", function($scope, $firebase, scResolve) {
	var songsRef = new Firebase("https://shining-fire-6877.firebaseio.com/songs");
	var userSongsRef = new Firebase("https://shining-fire-6877.firebaseio.com/queue/next");
    $scope.allSongs = $firebase(songsRef);
    $scope.userSongs = $firebase(userSongsRef);
	$scope.submit = function(newsong) {
		// try and resolve track with soundcloud api
		// (using angular service deferred promise result)
		var trackPromise = scResolve.resolve(newsong.url);
		console.log(trackPromise);
		// wait on promise to return 
		trackPromise.then(function(resolvedSong) {
			console.log('submit ctrl adding resolved track: ');
			console.log('   title: ',resolvedSong.title, 'duration: ', resolvedSong.duration);
			console.log('   username: ', newsong.submitter);

			var song = {
				time_added: new Date().getTime(),
				added_by: newsong.submitter,
				likes: 1,
				last_liked: new Date().getTime(),
				duration: resolvedSong.duration,
				title: resolvedSong.title,
				play_count: 0,
				url: newsong.url,
				last_played: 0,
			}

            $scope.allSongs.$add(song).then(function(ref) {
                // add id of new song to user song queue
                addSongRef = {
                    'key': ref.name(),
                    'time_added': new Date().getTime()
                };
                $scope.userSongs.$add(addSongRef);
            });
			
			},
			function(e) {
				console.log(e);
				alert('That url was not a valid track');
			}
		); // trackPromise handlers end

		
	}; //$scop.submit defn end
	
});

