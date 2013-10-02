(function(){

	// Save a reference to the global object
	var root = this;
	var JazzEvents;
	if (typeof exports !== 'undefined') { JazzEvents = exports; } else { JazzEvents = root.JazzEvents = {}; }
	console.log("Loaded JazzEvents.")

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
			if (Jazz.disableFingers === false) JazzEvents.handleFingers();
		}

		if (Jazz.isGrabbing===false && JazzHands.isHoldingValidFinger() === false)
			JazzEvents.handleNavigation();
		JazzEvents.handleGestureEvents();
		JazzEvents.handleProgressNav();
		JazzEvents.handleGrabRelease();

		Jazz.event["frames"](Jazz.lastFrame);
	}

	/**
	 *	getFingersMap()
	 **/
	JazzEvents.getFingersMap = function (key) {
		if (Jazz.lastFrame.pointablesMap) {
			if (key)
				return Jazz.lastFrame.pointablesMap[key];
			else
				return Jazz.lastFrame.pointablesMap;
		}
		return undefined;
	}

	/**
	 * handleNavigation()
	 *
	 * Initate a timer and eventually trigger the "navigation" event.
	 * Event callbacks are bound by Jazz.on("navigation") 
	 *
	 * Determine if a pointable (finger) is being held in a "hot spot"
	 * and reset or start a timer before calling the bound callback method.
	 *	 
	 **/
	JazzEvents.handleNavigation = function () {

		if (JazzHands.getCapturedDigits() < Jazz.LAST_VALID_FINGER)
			return false;

		if (JazzHands.hasDetectedHand() === true) {
			if (JazzHands.isNewHandMotion() === true) {
				JazzEvents.clearTimeoutForNav();
				JazzEvents.setTimeoutForNav();
			}

			if (JazzUI.getDetectedNav() === false) {
			 	JazzEvents.clearTimeoutForNav();
 				Jazz.handNavigation = null;
			}

			Jazz.handNavigation = JazzUI.getDetectedNav();
			// Jazz.lastHandId = Jazz.hands[0].id;
		}
	}


	JazzEvents.handleGrabRelease = function() {
		if (Jazz.hands.length === 0) {
			if (Jazz.isGrabbing === true) {
				Jazz.isGrabbing=false;
				Jazz.event["release"]();
			}
			return;
		}
		// TODO: Surface this HACK (1 finger === grab)
		if (JazzHands.getCapturedDigits() <= 1) {
			
			if (Jazz.isGrabbing === false) Jazz.event["grab"]();
			Jazz.isGrabbing = true;

		} else {

			if (Jazz.isGrabbing == true) {
				Jazz.isGrabbing = false;
				Jazz.event["release"]();
			}
		}

	}

	// TODO: Add zooming percentages and clean method up
	JazzEvents.handleProgressNav = function(detectedNav) {
		if (Jazz.hands.length === 0) return;
		var verticalDistance = JazzConfig.threshold("up") - JazzConfig.threshold("down");
		var upProgress = (JazzHands.palm("vertical") -  JazzConfig.threshold("down")) / verticalDistance;
		if (upProgress > 1) upProgress = 1;
		if (upProgress < 0) upProgress = 0;
		var downProgress = 1-upProgress;

		var horizontalDistance = JazzConfig.threshold("right") - JazzConfig.threshold("left");
		var rightProgress = (JazzHands.palm("horizontal") -  JazzConfig.threshold("left")) / horizontalDistance;
		if (rightProgress > 1) rightProgress = 1;
		if (rightProgress < 0) rightProgress = 0;
		var leftProgress = 1-rightProgress;

		var depthDistance = JazzConfig.threshold("zoomIn") - JazzConfig.threshold("zoomOut");
		var zoomInProgress = (JazzHands.palm("depth") -  JazzConfig.threshold("zoomOut")) / depthDistance;
		if (zoomInProgress > 1) zoomInProgress = 1;
		if (zoomInProgress < 0) zoomInProgress = 0;
		var zoomOutProgress = 1-zoomInProgress;

		var navProgress = {
			"up": parseInt(upProgress*100),
			"down": parseInt(downProgress*100),
			"right": parseInt(rightProgress*100),
			"left": parseInt(leftProgress*100),
			"zoomIn": parseInt(zoomInProgress*100),
			"zoomOut": parseInt(zoomOutProgress*100),
		}
		Jazz.event["progress"](navProgress);

		return navProgress;
	}



	/**
	 * handleFingers()
	 *
	 * Initate a timer and eventually trigger the "fingers" event.
	 * Event callbacks are bound by Jazz.on("fingers") 
	 *
	 * Determine if a new finger count is found, 
	 * and reset or start the timer for the fingers being held.
	 **/
	JazzEvents.handleFingers = function () {

		if (JazzHands.isNewFingerCount()) 
			JazzEvents.clearTimeoutForDigits();
		
		if (JazzHands.isHoldingValidFinger()) 
			JazzEvents.setTimeoutForDigits();
		
		Jazz.lastDigitsFound = JazzHands.getCapturedDigits();
	}

	/** 
	 *  TODO: Clean method up and add specs
	 *
	 * 	handleGestureEvents()
	 *
	 *  Allow binding to the Jazz.on("gesture") event
	 *  to simplify the callback for LEAP generated gestures.
	 **/
	 JazzEvents.handleGestureEvents = function () {
		var gestures = Jazz.lastFrame.gestures;
		if (JazzHands.getCapturedDigits() > 0 && gestures.length > 0) {
			for (var indx=0; indx < gestures.length; indx++) {
				var g = gestures[indx];
				Jazz.lastGesture = g;
			}
		}
		else {
			if (Jazz.lastGesture) {
				var g = Jazz.lastGesture;
				var validGesture = true;

				if (g.type === "circle" && g.radius < 100)
					validGesture = false;

				if (validGesture === true) 
					Jazz.event["gestures"](Jazz.lastGesture);
				Jazz.lastGesture = null;
			}
		}
	 }


	/**
	 * 	clearTimeoutForDigits()
	 *
	 * 	Reset the timer, cancelling all upcoming "fingers" events
	 **/
	JazzEvents.clearTimeoutForDigits = function () {

		if (Jazz.frameDigitCount > 0) {
			clearTimeout(Jazz.intervalTimer);
			Jazz.lastDigitsFound = Jazz.incr = Jazz.timerPercentage = 0;
		}
	}

	/**
	 * 	setTimeoutForDigits()
	 *
	 *	Set the timer for an upcoming "fingers" event
	 **/	
	JazzEvents.setTimeoutForDigits = function () {
	    JazzEvents.clearTimeoutForDigits();
	    
	    Jazz.intervalTimer = setInterval(function() {

	        Jazz.incr += Jazz.WAIT_INTERVAL_TIMER;

	        if (JazzUI.getTimerPercentage() > 100) {
	        	clearTimeout(Jazz.intervalTimer);
		        if (Jazz.hands.length > 0 && Jazz.lastDigitsFound < Jazz.LAST_VALID_FINGER) {
		        	Jazz.event["fingers"](JazzHands.getCapturedDigits());
		        }
	        }

	    }, Jazz.WAIT_INTERVAL_TIMER);
	}

	/**
	 * 	clearTimeoutForNav()
	 *
	 *	Reset the timer, cancelling all upcoming "navigation" events
	 **/
	JazzEvents.clearTimeoutForNav = function () {
		clearTimeout(Jazz.intervalTimer);
		Jazz.handNavigation = Jazz.incr = Jazz.timerPercentage = 0;
	}

	/**
	 * setTimeoutForNav()
	 *
	 *	Set the timer for an upcoming "navigation" event
	 **/	
	JazzEvents.setTimeoutForNav = function () {
	    JazzEvents.clearTimeoutForNav();
	    
	    Jazz.intervalTimer = setInterval(function() {
	        Jazz.incr += Jazz.WAIT_INTERVAL_TIMER;

	        if (JazzUI.getTimerPercentage() > 100) {
	        	clearTimeout(Jazz.intervalTimer);
				if (Jazz.hands.length > 0) {
		        	Jazz.event["navigation"](Jazz.handNavigation);
		        	Jazz.lastHand = Jazz.handNavigation;
					Jazz.repeatNavInterval = setTimeout(function() {
						if (Jazz.handNavigation === Jazz.lastHand) {						
							JazzEvents.clearTimeoutForNav();
							clearTimeout(Jazz.repeatNavInterval);
						}
					}, 900);
				}
			}
	    }, Jazz.WAIT_INTERVAL_TIMER);
	}

})();