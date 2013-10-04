function JazzEvents() {

	var jzUI = Jazz.jzUI;
	var jzHands = Jazz.jzHands;
	var helper = new JazzEventHelper();

	/** 
	 * this.loop() 
	 *
	 * Jazz overrides the Leap event loop, and is internally referenced.
	 * This method is automatically initiated by Jazz.init()
	 */
	this.loop = function (frame) {

		Jazz.lastFrame = frame;
		Jazz.hands = frame.hands;

		if (Jazz.hands.length > 0)
			// TODO: move show/hide canvas to UI
			jzUI.showCanvas();
		else {
			jzUI.hideCanvas();
			Jazz.handNavigation = null;
		}

		Jazz.frameDigitCount = frame.pointables.length;

		jzUI.updateCanvas();

		// DYNAMICALLY SWITCH from simple mode
		// are we holding up more than last_valid fingers?
		if (Jazz.frameDigitCount >= Jazz.LAST_VALID_FINGER) {
			Jazz.simpleMode = true;
		}
		else {
			Jazz.simpleMode = false;
			if (Jazz.disableFingers === false) helper.handleFingers();
		}

		if (Jazz.isGrabbing===false && jzHands.isHoldingValidFinger() === false)
			helper.handleNavigation();
		helper.handleGestureEvents();
		helper.handleProgressNav();
		helper.handleGrabRelease();

		Jazz.event["frames"](Jazz.lastFrame);
	}

	this.getFingersMap = function (key) {
		if (Jazz.lastFrame.pointablesMap) {
			if (key)
				return Jazz.lastFrame.pointablesMap[key];
			else
				return Jazz.lastFrame.pointablesMap;
		}
		return undefined;
	}

}