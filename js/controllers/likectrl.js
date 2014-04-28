angular.module('riseApp.controllers').controller("LikeSongCtrl", function($scope, $firebase) {
    var songsRef = new Firebase("https://shining-fire-6877.firebaseio.com/songs");
    $scope.allSongs = $firebase(songsRef);
});