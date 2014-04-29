angular.module('riseApp.controllers').controller("LeaderboardCtrl", function($scope, $firebase) {
    var songsRef = new Firebase(firebaseRoot + "/songs");

    $scope.users = [];

    songsRef.on('value', function(snapshot) {
        var songs = snapshot.val();
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
