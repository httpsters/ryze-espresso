// on production, remove the /dev
// while developing, use the /dev
var firebaseRoot = "https://shining-fire-6877.firebaseio.com";

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

angular.module('riseApp.services')
.factory('scResolve', function ($http, $q) {
	return {
		// query soundcloud api to resolve track by url
		// returns track metadata object
	    resolve: function (trackUrl) {
	        var deferred = $q.defer();

	        $http({
	        	method:"GET", 
	        	url:'http://api.soundcloud.com/resolve.json?url=' + trackUrl + '&client_id=e886c21459d731e8ac7aeedcb3c3b4bb'
	    	})
	    	.success(function (result) {
    			deferred.resolve(result);
	    	})
			.error(function (e) {
				deferred.reject(e);
			})

	        return deferred.promise;
	    } // end resolve fn
	} //end scService factory

}); // end resolve track factory
angular.module('riseApp.controllers').controller('AdminCtrl', function($scope, $firebase, $route) {

    var songsRef = $firebase(new Firebase(firebaseRoot + "/songs"));
    var queueRef = $firebase(new Firebase(firebaseRoot + "/queue/next"));

	$scope.songs = [];

	songsRef.$on('value', function(snapshot) {
		$scope.songs = []; // reset
		var songs = snapshot.snapshot.value;
		for (var songId in songs) {
			var song = songs[songId];
			song.id = songId;
			$scope.songs.push(song);
		}
	});


	$scope.removeSong = function(song) {
		console.debug('removing song', song, song.id);
		songsRef.$remove(song.id);
		queueRef.$on('value', function(snapshot) {
			var queue = snapshot.snapshot.value;
			for (var queueId in queue) {
				var queuedSongId = queue[queueId];
				if (song.id === queuedSongId) {
					queueRef.$remove(queueId);
				}
			}
		});
	};
});

angular.module('riseApp.controllers').controller("LeaderboardCtrl", function($scope, $firebase) {
    var songsRef = new Firebase(firebaseRoot + "/songs");

    $scope.users = [];

    songsRef.on('value', function(snapshot) {
		console.debug('leaderboardctrl: got snapshot', snapshot);
        var songs = snapshot.val();
		console.debug('leaderboardctrl: got snapshot.val', snapshot.val());
        users = {};

        // grab users and likes from the full list of songs
        for (var songId in songs) {
            song = songs[songId];
            username = song['added_by'];
            likes = song['likes'];
            if (username in users) {
                users[username] += likes;
            } else {
                users[username] = likes;
            }
        };

        // convert the results from above into an array of objects,
        // push the objects to angular scope
        $scope.users = []; // reset
        for (var username in users) {
            user = {};
            user.username = username;
            user.likes = users[username];
            $scope.users.push(user);
        };

    });

});

angular.module('riseApp.controllers').controller("LikeSongCtrl", function($scope, $firebase) {
    var songsRef = new Firebase(firebaseRoot + "/songs");
    $scope.allSongs = $firebase(songsRef);
});

angular.module('riseApp.controllers').controller("PlayerCtrl", function($scope, $rootScope, $firebase) {

    var url = firebaseRoot;
    var queueRef = $firebase(new Firebase(url + "/queue"));
    var songsRef = $firebase(new Firebase(url + "/songs"));
    //$scope.nowplaying = $firebase(nowplaying_ref);

    var widgetIframe = document.getElementById('sc-widget');
    var widget       = SC.Widget(widgetIframe);

    $rootScope.currentSong = {};

    // current song handler
    // plays new song as set by backend streaming
    queueRef.$child('cur').$on('value', function(dataSnapshot) {
        var songid = dataSnapshot.snapshot.value;
        console.log('current song firebase id: ',songid);
        // get url for song by id
        var song = $rootScope.currentSong = songsRef.$child(songid);
        var songurl = song.url;
        console.log('songurl: ',songurl);

        widget.load(songurl, {
            auto_play: true,
            show_artwork: true,
            visual: true,
            buying: false,
            liking: false,
            download: false,
            sharing: false,
            show_comments: false,
            show_playcount: false,
            show_user: false,
        });
    }); //current song handler end

    // for getting the upcoming songs on the queue
    var nextRef = $firebase(new Firebase(url + "/queue/next"));
    $rootScope.upcomingSongs = [];

    nextRef.$on('value', function(snap) {
        nextSongs = snap.snapshot.value;
        $rootScope.upcomingSongs = []; // clear scope
        for (var key in nextSongs) {
            songId = nextSongs[key].key;
            console.log('next song id is', songId);
            song = songsRef.$child(songId);
            if (song.title && song.url)
                $rootScope.upcomingSongs.push(song);
        };
    });

});


angular.module('riseApp.controllers').controller("RecentlyPlayedCtrl", function($scope, $rootScope, $firebase) {
    url = firebaseRoot;
    var songsRef = $firebase(new Firebase(url + "/songs"));

    $scope.allSongs = [];

    songsRef.$on('value', function() {
        $scope.allSongs = [];
        songsRef.$getIndex().forEach(function(songId) {
            song = songsRef.$child(songId);
            song.id = songId;
            $scope.allSongs.push(song);
        });
    });

    // memory of liked songs
    $rootScope.likedSongs = {};

    $rootScope.songIsLiked = function(songId) {
        return songId in $rootScope.likedSongs;
    };

    $rootScope.toggleLike = function(songId) {
        update = {};
        song = songsRef.$child(songId);

        if (songId in $rootScope.likedSongs) {
            console.debug("unliking song", songId);
            update = { likes: song.likes - 1 };
            delete $rootScope.likedSongs[songId];    // remove key
        } else {
            console.debug('like song', songId);
            update = {
                likes: song.likes + 1,
                last_liked: new Date().getTime()
            };
            $rootScope.likedSongs[songId] = true;
        }
        song.$update(update); // make changes and save to firebase
    };

});

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
