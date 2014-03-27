angular.module('riseApp.controllers').controller("PlayerCtrl", function($scope, $firebase) {

    var url = "https://shining-fire-6877.firebaseio.com";
	var queueRef = new Firebase(url + "/queue");
	//$scope.nowplaying = $firebase(nowplaying_ref);

	var widgetIframe = document.getElementById('sc-widget');
	var widget       = SC.Widget(widgetIframe);

	// current song handler
	// plays new song as set by backend streaming
  	queueRef.child('cur').on('value', function(dataSnapshot) {
  		var songid = dataSnapshot.val();
		console.log('current song firebaase id: ',songid);
		// get url for song by id
		var songurl = $firebase(songsRef.child(child(songid))).url;
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
	var songsRef = $firebase(new Firebase(url + "/songs"));
    var nextRef = $firebase(new Firebase(url + "/queue/next"));
    $scope.upcomingSongs = [];

    nextRef.$on('value', function(snap) {
        nextSongs = snap.snapshot.value;
        $scope.upcomingSongs = []; // clear scope
        for (var key in nextSongs) {
            songId = nextSongs[key];
            song = songsRef.$child(songId);
            $scope.upcomingSongs.push(song);
        };
    });

});

