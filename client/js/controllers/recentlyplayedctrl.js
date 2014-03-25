angular.module('riseApp.controllers').controller("RecentlyPlayedCtrl", function($scope, $firebase) {
    var songsRef = new Firebase("https://shining-fire-6877.firebaseio.com/songs");
    var recentRef = new Firebase("https://shining-fire-6877.firebaseio.com/songs");

    // bind firebase recent songs to the scope
    $scope.recentSongs = $firebase(recentRef);

    // memory of liked songs
    $scope.likedSongs = [];

    songs = $firebase(songsRef);

    $scope.likeSong = function(songId) {
        if ($scope.likedSongs.indexOf(songId) !== -1) {
            console.debug("already liked this song");
            return;
        }
        song = songs.$child(songId);
        song.$update({likes: song.likes+1});
        console.debug('liked song', songId);
        $scope.likedSongs.push(songId);
    };


});
