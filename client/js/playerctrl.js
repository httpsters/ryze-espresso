angular.module('riseApp.controllers').controller("PlayerCtrl", function($scope, $firebase) {
	var nowplaying_ref = new Firebase("https://shining-fire-6877.firebaseio.com/nowplaying");
	var queue_ref = new Firebase("https://shining-fire-6877.firebaseio.com/queue/")
	
	//$scope.nowplaying = $firebase(nowplaying_ref);

	var widgetIframe = document.getElementById('sc-widget');
	var widget       = SC.Widget(widgetIframe);

  	nowplaying_ref.on('value', function(dataSnapshot) {
		console.log('ds.cur',dataSnapshot.val().cur); // subset of the returned value
		
		var newSoundUrl = dataSnapshot.val().cur;//'http://api.soundcloud.com/tracks/' + value.cur;
		$scope.nowplaying = newSoundUrl;
		widget.load(newSoundUrl, {
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

