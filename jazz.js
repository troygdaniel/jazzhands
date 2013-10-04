//     jshands.js 0.5 Alpha
//     (c) 2013 Troy Daniel
//     Jazz hands may be freely distributed under the MIT license.

(function(){

	var Jazz = this.Jazz = {}
	Jazz.jzHands = new JazzHands();
	Jazz.jzUI = new JazzUI();
	Jazz.jzConfig = new JazzConfig();
	Jazz.jzEvents = new JazzEvents();

	Jazz.$ = this.jQuery;
	Jazz.VERSION = '0.5';

	Jazz.init = function (options, callback) {

		Jazz.jzConfig.configureFromOptions(options);
		Jazz.leapController = new Leap.Controller({enableGestures: true}); 
		Jazz.canvas = Jazz.jzUI.appendCanvasToDOM(); //document.getElementById(options.canvas);
		Jazz.jzUI.createFingerCanvas();

		Jazz.leapController.loop(function(frame) { Jazz.jzEvents.loop(frame); })

		// optional callback
		if (callback) callback();

	};

	Jazz.show = function () { Jazz.jzUI.show();};
	Jazz.hide = function () { Jazz.jzUI.showUI = false;}
	Jazz.clearFingersText = function () { Jazz.jzUI.clearFingersText();};
	Jazz.setFingersText = function(hoverText) { Jazz.jzUI.setFingersText(hoverText); };
	Jazz.on = function (event, callback) {
		Jazz.event[event] = callback;
	}
}).call(this);