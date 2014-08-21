angular.module('riseApp.controllers').controller("SubmitCtrl", function($scope, $firebase, $http, $timeout, scResolve) {
	var songsRef = new Firebase(firebaseRoot + "/songs");
	var userSongsRef = new Firebase(firebaseRoot + "/queue/next");
	var clientId = 'e886c21459d731e8ac7aeedcb3c3b4bb';

	$scope.submission = { // this has info for song that will get submitted to the db
		url: '',
		user: ''
	};

	$scope.autocomplete = '';
	$scope.fullSuggestions = [];
	$scope.acSuggestions = [];

	$scope.acUpdate = function(query) {
		if (query.length < 3) {
			$scope.submission.url = '';
			$scope.acSuggestions = [];
			return;
		}

		var limit = 10;
		var url = "http://api.soundcloud.com/tracks.json?q=" + query + "&limit=" + limit + "&client_id=" + clientId;

		$http.get(url).success(function(songs) {
			$scope.fullSuggestions = songs;
			var toString = function(song) {
				var title = song.title,
				artist = song.user.username;
				return '' + title + ' - ' + artist;
			};
			var listOptions = _.map(songs, toString);
			$scope.acSuggestions = listOptions;
		});
	};

	$scope.acSelect = function(index, songName) {
		var selectedSong = $scope.fullSuggestions[index];
		$scope.submission.url = selectedSong.permalink_url;
	};

	$scope.submitIsDisabled = function() {
		var urlIsValid = function() {
			var url = $scope.submission.url;
			if (!url || url === '') { return false; }
			var match = url.match(/http.*\/\/soundcloud.com\/(.*)\/(.*)/);
			return match !== null;
		};
		var userIsValid = function() {
			var user = $scope.submission.user;
			if (!user || user === '') { return false; }
			return true;
		};
		var isValid = urlIsValid() && userIsValid();
		return !isValid; // true (disabled) when invalid, false (enabled) when valid
	};

	$scope.allSongs = $firebase(songsRef);
	$scope.userSongs = $firebase(userSongsRef);

	$scope.confShowing = false;
	$scope.showConf = function() {
		$scope.confShowing = true;
		$timeout(function() {
			$scope.confShowing = false;
		}, 4000);
	};

	$scope.submit = function() {
		var submission = $scope.submission;
		// try and resolve track with soundcloud api
		// (using angular service deferred promise result)
		var trackPromise = scResolve.resolve(submission.url);
		console.debug(trackPromise);
		// wait on promise to return
		trackPromise.then(
			function(resolvedSong) {
			console.debug("resolved song is", resolvedSong);
			console.debug('submit ctrl adding resolved track: ');
			console.debug('   title: ', resolvedSong.title, 'duration: ', resolvedSong.duration);
			console.debug('   username: ', submission.user);

			var song = {
				time_added: new Date().getTime(),
				added_by: submission.user,
				likes: 1,
				last_liked: new Date().getTime(),
				duration: resolvedSong.duration,
				title: resolvedSong.title,
				play_count: 0,
				url: resolvedSong.permalink_url,
				last_played: 0,
			};

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
	};
});
