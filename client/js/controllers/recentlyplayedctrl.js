angular.module('riseApp.controllers').controller("RecentlyPlayedCtrl", function($scope, $firebase) {
    var songsRef = new Firebase("https://shining-fire-6877.firebaseio.com/songs");
    var recentRef = new Firebase("https://shining-fire-6877.firebaseio.com/songs");

    // bind firebase recent songs to the scope
    $scope.recentSongs = $firebase(recentRef);

    songs = $firebase(songsRef);

    $scope.likeSong = function(songId) {
        song = songs.$child(songId);
        song.$update({likes: song.likes+1});
    };


});
