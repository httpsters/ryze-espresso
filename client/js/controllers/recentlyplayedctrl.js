angular.module('riseApp.controllers').controller("RecentlyPlayedCtrl", function($scope, $firebase) {
    var songsRef = new Firebase("https://shining-fire-6877.firebaseio.com/songs");
    var recentRef = new Firebase("https://shining-fire-6877.firebaseio.com/songs");

    $scope.recentSongs = [];

    recentRef.on('value', function(snapshot) {
        recentQueue = snapshot.val();
        $scope.recentSongs = [];

        for (var songId in recentQueue) {
            songsRef.child(songId).on('value', function(snap) {
                song = snap.val();
                $scope.recentSongs.push(song);
            });
        };
    });
});
