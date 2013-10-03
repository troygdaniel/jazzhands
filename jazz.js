//     jshands.js 0.5 Alpha
//     (c) 2013 Troy Daniel
//     Jazz hands may be freely distributed under the MIT license.

(function(){

	var root = this;
	var Jazz = root.Jazz = {}
	Jazz.$ = root.jQuery;
	Jazz.VERSION = '0.5';

	Jazz.init = function (options, callback) {

		JazzConfig.configureFromOptions(options);
		Jazz.leapController = new Leap.Controller({enableGestures: true}); 
		Jazz.canvas = JazzUI.appendCanvasToDOM(); //document.getElementById(options.canvas);
		JazzUI.createFingerCanvas();

		Jazz.leapController.loop(function(frame) { JazzEvents.loop(frame); })

		// optional callback
		if (callback) callback();

	};

	Jazz.show = function () { JazzUI.show();};
	Jazz.hide = function () { JazzUI.showUI = false;}
	Jazz.clearFingersText = function () { JazzUI.clearFingersText();};
	Jazz.setFingersText = function(hoverText) { JazzUI.setFingersText(hoverText); };
	Jazz.on = function (event, callback) {
		Jazz.event[event] = callback;
	}


}).call(this);