//     jshands.js 0.5 Alpha

//     (c) 2013 Troy Daniel
//     Jazz hands may be freely distributed under the MIT license.

(function(){

	// Initial Setup
	// -------------

	// Save a reference to the global object
	var root = this;
	var Jazz;


	if (typeof exports !== 'undefined') { Jazz = exports; } else { Jazz = root.Jazz = {}; }

	// For Jazz's purposes, jQuery owns the `$` variable.
	Jazz.$ = root.jQuery;

	// Current version of the library. Keep in sync with `package.json`.
	Jazz.VERSION = '0.5';
	/**
	 * Jazz.init()
	 * 
	 * Initialize all that Jazz 
	 */
	Jazz.init = function (options, callback) {

		console.log("about to");
		
		JazzConfig.configureFromOptions(options);
		Jazz.leapController = new Leap.Controller({enableGestures: true}); 
		Jazz.canvas = JazzUI.appendCanvasToDOM(); //document.getElementById(options.canvas);
		JazzUI.createFingerCanvas();

		Jazz.leapController.loop(function(frame) { JazzEvents.loop(frame); })

		// optional callback
		if (callback) callback();

	};

	// TODO: document these functions
	Jazz.show = function () { JazzUI.show();};
	Jazz.hide = function () { JazzUI.showUI = false;}
	Jazz.clearFingersText = function () { JazzUI.clearFingersText();};
	Jazz.setFingersText = function(hoverText) { JazzUI.setFingersText(hoverText); };
	/** 
	 *	Jazz.on()
	 *
	 *	Setup a binding to the finger, navigation or gesture events
	 * 
	 *  Example usage:
	 *
	 *	Jazz.on("finger", function(fingers) {
	 *		console.log("on fingers = " + fingers)
	 *	});
	 *
	 *	Jazz.on("navigation", function(navEvent) {
	 *		console.log("navigation = "+ navEvent);
	 *	});
	 *	Jazz.on("gestures", function (gestures) {
	 *		console.log(gestures);
	 *	});
	 *
	 *
	 **/
	Jazz.on = function (event, callback) {
		Jazz.event[event] = callback;
	}


}).call(this);