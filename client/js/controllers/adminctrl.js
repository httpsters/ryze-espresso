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
