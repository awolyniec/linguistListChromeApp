chrome.app.runtime.onLaunched.addListener(
		function () {
		  //Sets the dimension of the window
		  var dWidth = window.screen.width;
		  var dHeight = window.screen.height;
		  if (dWidth >= 768) {
		    dWidth = 768;
		  }
			chrome.app.window.create("pageViews/index.html", {
			  bounds: {width: dWidth, height: dHeight},
			});
		}
);