angular.module('riseApp.controllers').controller("RecentlyPlayedCtrl", function($scope, $firebase) {
    var songsRef = new Firebase("https://shining-fire-6877.firebaseio.com/songs");
    var recentRef = new Firebase("https://shining-fire-6877.firebaseio.com/songs");

    // bind firebase recent songs to the scope
    $scope.recentSongs = $firebase(recentRef);

    // memory of liked songs
    $scope.likedSongs = {};

    songs = $firebase(songsRef);

    $scope.songIsLiked = function(songId) {
        return songId in $scope.likedSongs;
    };

    $scope.toggleLike = function(songId) {
        update = {};
        song = songs.$child(songId);

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
