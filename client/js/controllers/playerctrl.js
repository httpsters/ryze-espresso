angular.module('riseApp.controllers').controller("PlayerCtrl", function($scope, $firebase) {
	var queueRef = new Firebase("https://shining-fire-6877.firebaseio.com/queue");
	var songsRef = new Firebase("https://shining-fire-6877.firebaseio.com/songs");
    $scope.upcomingSongs = $firebase(queueRef);
	//$scope.nowplaying = $firebase(nowplaying_ref);

	var widgetIframe = document.getElementById('sc-widget');
	var widget       = SC.Widget(widgetIframe);

	// new current song handler
	// plays new song as set by backend streaming
  	queueRef.child('cur').on('value', function(dataSnapshot) {
  		var songid = dataSnapshot.val();
		console.log('current song firebaase id: ',songid);
		// get url for song by id
		var songurl = $firebase(songsRef.child(child(songid)).url;
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
	});
});

