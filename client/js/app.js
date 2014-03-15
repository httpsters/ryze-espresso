var app = angular.module("riseApp", ["firebase"]);

app.controller("PlayerCtrl", function ($scope, $firebase) {
	var nowplaying_ref = new Firebase("https://shining-fire-6877.firebaseio.com/nowplaying");
	// nowplaying_ref.on('value', function(snapshot) {
	//   $scope.nowplaying = snapshot.val();
	// });
	$scope.nowplaying = $firebase(nowplaying_ref);

	var widgetIframe = document.getElementById('sc-widget');
	var widget       = SC.Widget(widgetIframe);

  	nowplaying_ref.on('value', function(dataSnapshot) {
		console.log('ds.cur',dataSnapshot.val().cur); // subset of the returned value
		
		var newSoundUrl = dataSnapshot.val().cur;//'http://api.soundcloud.com/tracks/' + value.cur;

		widget.load(newSoundUrl);
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


}
);

