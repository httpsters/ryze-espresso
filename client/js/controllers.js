angular.module('riseApp.controllers', [])
.controller("PlayerCtrl", function ($scope, $firebase) {
	var nowplaying_ref = new Firebase("https://shining-fire-6877.firebaseio.com/nowplaying");
	
	$scope.nowplaying = $firebase(nowplaying_ref);

	var widgetIframe = document.getElementById('sc-widget');
	var widget       = SC.Widget(widgetIframe);

  	nowplaying_ref.on('value', function(dataSnapshot) {
		console.log('ds.cur',dataSnapshot.val().cur); // subset of the returned value
		
		var newSoundUrl = dataSnapshot.val().cur;//'http://api.soundcloud.com/tracks/' + value.cur;

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

	widget.bind(SC.Widget.Events.READY, function() {
      // load new widget
      widget.bind(SC.Widget.Events.FINISH, function() {
        widget.load(newSoundUrl, {
          auto_play: true
        });
      });
    });
  // 	$scope.nowplaying.$on('loaded', function(value) {
		// console.log(value); // data loaded from Firebase
		// console.log(value.cur); // subset of the returned value
		// var widgetIframe = document.getElementById('sc-widget');
		// var widget       = SC.Widget(widgetIframe);
		// var newSoundUrl = value.cur;//'http://api.soundcloud.com/tracks/' + value.cur;

		// widget.load(newSoundUrl);
  //   });


})
.controller("LikeSongCtrl", function($scope, $firebase) {
    var songsRef = new Firebase("https://shining-fire-6877.firebaseio.com/songs");
    $scope.allSongs = $firebase(songsRef);
});
