(function(){

	var root = this;
	var JazzEvents = root.JazzEvents = {};

	/** 
	 * JazzEvents.loop() 
	 *
	 * Jazz overrides the Leap event loop, and is internally referenced.
	 * This method is automatically initiated by Jazz.init()
	 */
	JazzEvents.loop = function (frame) {

		Jazz.lastFrame = frame;
		Jazz.hands = frame.hands;

		if (Jazz.hands.length > 0)
			// TODO: move show/hide canvas to UI
			JazzUI.showCanvas();
		else {
			JazzUI.hideCanvas();
			Jazz.handNavigation = null;
		}

		Jazz.frameDigitCount = frame.pointables.length;

		JazzUI.updateCanvas();

		// DYNAMICALLY SWITCH from simple mode
		// are we holding up more than last_valid fingers?
		if (Jazz.frameDigitCount >= Jazz.LAST_VALID_FINGER) {
			Jazz.simpleMode = true;
		}
		else {
			Jazz.simpleMode = false;
			if (Jazz.disableFingers === false) JzEventHelp.handleFingers();
		}

		if (Jazz.isGrabbing===false && JazzHands.isHoldingValidFinger() === false)
			JzEventHelp.handleNavigation();
		JzEventHelp.handleGestureEvents();
		JzEventHelp.handleProgressNav();
		JzEventHelp.handleGrabRelease();

		Jazz.event["frames"](Jazz.lastFrame);
	}

	JazzEvents.getFingersMap = function (key) {
		if (Jazz.lastFrame.pointablesMap) {
			if (key)
				return Jazz.lastFrame.pointablesMap[key];
			else
				return Jazz.lastFrame.pointablesMap;
		}
		return undefined;
	}

}).call(this);