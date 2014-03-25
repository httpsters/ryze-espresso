angular.module('riseApp.controllers').controller("RecentlyPlayedCtrl", function($scope, $firebase) {
    url = "https://shining-fire-6877.firebaseio.com";
    var songsRef = $firebase(new Firebase(url + "/songs"));

    $scope.recentSongs = [];

    songsRef.$on('value', function() {
        $scope.recentSongs = [];
        songsRef.$getIndex().forEach(function(songId) {
            song = songsRef.$child(songId);
            song.id = songId;
            $scope.recentSongs.push(song);
        });
    });

    // memory of liked songs
    $scope.likedSongs = {};

    $scope.songIsLiked = function(songId) {
        return songId in $scope.likedSongs;
    };

    $scope.toggleLike = function(songId) {
        update = {};
        song = songsRef.$child(songId);

        if (songId in $scope.likedSongs) {
            console.debug("unliking song", songId);
            update = { likes: song.likes - 1 };
            delete $scope.likedSongs[songId];    // remove key
        } else {
            console.debug('like song', songId);
            update = {
                likes: song.likes + 1,
                last_liked: new Date().getTime()
            };
            $scope.likedSongs[songId] = true;
        }
        song.$update(update); // make changes and save to firebase
    };

});
