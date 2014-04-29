angular.module('riseApp.controllers').controller("PlayerCtrl", function($scope, $rootScope, $firebase) {

    var url = firebaseRoot;
    var queueRef = $firebase(new Firebase(url + "/queue"));
    var songsRef = $firebase(new Firebase(url + "/songs"));
    //$scope.nowplaying = $firebase(nowplaying_ref);

    var widgetIframe = document.getElementById('sc-widget');
    var widget       = SC.Widget(widgetIframe);

    $rootScope.currentSong = {};

    // current song handler
    // plays new song as set by backend streaming
    queueRef.$child('cur').$on('value', function(dataSnapshot) {
        var songid = dataSnapshot.snapshot.value;
        console.log('current song firebase id: ',songid);
        // get url for song by id
        var song = $rootScope.currentSong = songsRef.$child(songid);
        var songurl = song.url;
        console.log('songurl: ',songurl);

        widget.load(songurl, {
            auto_play: true,
            show_artwork: true,
            visual: true,
            buying: false,
            liking: false,
            download: false,
            sharing: false,
            show_comments: false,
            show_playcount: false,
            show_user: false,
        });
    }); //current song handler end

    // for getting the upcoming songs on the queue
    var nextRef = $firebase(new Firebase(url + "/queue/next"));
    $rootScope.upcomingSongs = [];

    nextRef.$on('value', function(snap) {
        nextSongs = snap.snapshot.value;
        $rootScope.upcomingSongs = []; // clear scope
        for (var key in nextSongs) {
            songId = nextSongs[key].key;
            console.log('next song id is', songId);
            song = songsRef.$child(songId);
            if (song.title && song.url)
                $rootScope.upcomingSongs.push(song);
        };
    });

});

