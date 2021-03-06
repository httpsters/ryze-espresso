angular.module('riseApp.controllers').controller("RecentlyPlayedCtrl", function($scope, $rootScope, $firebase) {
    url = "https://shining-fire-6877.firebaseio.com";
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
