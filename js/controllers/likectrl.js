angular.module('riseApp.controllers').controller("LikeSongCtrl", function($scope, $firebase) {
    var songsRef = new Firebase(firebaseRoot + "/songs");
    $scope.allSongs = $firebase(songsRef);
});
