//     jshands.js 0.5 Alpha
//     (c) 2013 Troy Daniel
//     Jazz hands may be freely distributed under the MIT license.

(function(){

	var Jazz = this.Jazz = {}
	Jazz.hands = new JazzHands();
	Jazz.ui = new JazzUI();
	Jazz.config = new JazzConfig();
	Jazz.events = new JazzEvents();
	Jazz.$ = this.jQuery;
	Jazz.VERSION = '0.5';

	Jazz.init = function (options, callback) {

		Jazz.config.configureFromOptions(options);
		Jazz.leapController = new Leap.Controller({enableGestures: true}); 
		Jazz.ui.createFingerCanvas();
		Jazz.leapController.loop(function(frame) { Jazz.events.loop(frame); })

		if (callback) callback();
	};

	Jazz.show = function () { Jazz.ui.show();};
	Jazz.hide = function () { Jazz.ui.showUI = false;}
	Jazz.clearFingersText = function () { Jazz.ui.clearFingersText();};
	Jazz.setFingersText = function(hoverText) { Jazz.ui.setFingersText(hoverText); };
	Jazz.on = function (event, callback) {
		Jazz.event[event] = callback;
	}
}).call(this);