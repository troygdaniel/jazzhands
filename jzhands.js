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

	// Current version of the library. Keep in sync with `package.json`.
	Jazz.VERSION = '0.5';
	/**
	 * Jazz.init()
	 * 
	 * Initialize all that Jazz 
	 */
	Jazz.init = function (options, callback) {
		configureFromOptions(options);
		Jazz.leapController = new Leap.Controller({enableGestures: true}); 
		Jazz.canvas = appendCanvasToDOM(); //document.getElementById(options.canvas);
		createFingerCanvas();

		Jazz.leapController.loop(function(frame) { Jazz.loop(frame); })

		// optional callback
		if (callback) callback();
	}

	/** 
	 * Jazz.loop() 
	 *
	 * Jazz overrides the Leap event loop, and is internally referenced.
	 * This method is automatically initiated by Jazz.init()
	 */
	Jazz.loop = function (frame) {

		Jazz.lastFrame = frame;
		Jazz.hands = frame.hands;

		if (Jazz.hands.length > 0)
			showCanvas();
		else {
			hideCanvas();
			Jazz.handNavigation = null;
		}

		Jazz.frameDigitCount = frame.pointables.length;

		updateCanvas();

		// DYNAMICALLY SWITCH from simple mode
		// are we holding up more than last_valid fingers?
		if (Jazz.frameDigitCount >= Jazz.LAST_VALID_FINGER) {
			Jazz.simpleMode = true;
		}
		else {
			Jazz.simpleMode = false;
			if (Jazz.disableFingers === false) handleFingers();
		}

		if (Jazz.isGrabbing===false && isHoldingValidFinger() === false)
			handleNavigation();
		handleGestureEvents();
		handleProgressNav();
		handleGrabRelease();

		Jazz.event["frames"](Jazz.lastFrame);
	}
	// TODO: document these functions
	Jazz.show = function () {
		Jazz.showUI = true;
	}
	Jazz.hide = function () {
		Jazz.showUI = false;
	}
	
	Jazz.clearFingersText = function () {
		Jazz.fingersText = [];
		Jazz.disableFingers=false;
		Jazz.LAST_VALID_FINGER = 1;
	}


	Jazz.setFingersText = function(hoverText) {
		if (hoverText) {
			Jazz.fingersText = hoverText;
			Jazz.disableFingers=false;
			Jazz.LAST_VALID_FINGER = hoverText.length+1;
		} else {
			Jazz.clearFingersText();
		}
	}
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


	// -----------------------------
	//
	//     PRIVATE JAZZ METHODS
	//
	// -----------------------------

	/**
	 * updateCanvas()
	 *
	 * Update the canvas with the fingers and timer circles
	 **/
	var updateCanvas = function () {

		clearCanvas();
		var fIndex=0;
		// Build a grid for the jazz-hands canvas
		// render circles based on pointable positions
		for (var i in getFingersMap()) {

			var isLastFinger = (++fIndex === Jazz.lastFrame.fingers.length);
			var canDrawFingerText = (Jazz.timerPercentage > 10 && isLastFinger);
			var circleCoords = getFinger(i).tipPosition;

			if (Jazz.simpleMode === true && Jazz.hands.length > 0) {
				circleCoords = Jazz.hands[0].palmPosition;
			}

			drawCircle(circleCoords);

			if (Jazz.disableHelper === false) {
				drawHelperArrows();
			}

			if (Jazz.disableTimer === false)
				drawTimerArc(circleCoords, Jazz.timerPercentage);

			if (canDrawFingerText && Jazz.disableFingers === false) 
				drawFingerText();

			if (Jazz.simpleMode === true)
				return;
		}

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
	var handleNavigation = function () {

		if (getCapturedDigits() < Jazz.LAST_VALID_FINGER)
			return false;

		if (hasDetectedHand() === true) {
			if (isNewHandMotion() === true) {
				clearTimeoutForNav();
				setTimeoutForNav();
			}

			if (getDetectedNav() === false) {
			 	clearTimeoutForNav();
 				Jazz.handNavigation = null;
			}

			Jazz.handNavigation = getDetectedNav();
			// Jazz.lastHandId = Jazz.hands[0].id;
		}
	}

	var isNewHand = function() {
		return Jazz.lastHandId == Jazz.hands[0].id;
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
	var handleFingers = function () {

		if (isNewFingerCount()) 
			clearTimeoutForDigits();
		
		if (isHoldingValidFinger()) 
			setTimeoutForDigits();
		
		Jazz.lastDigitsFound = getCapturedDigits();
	}

	/** 
	 *  TODO: Clean method up and add specs
	 *
	 * 	handleGestureEvents()
	 *
	 *  Allow binding to the Jazz.on("gesture") event
	 *  to simplify the callback for LEAP generated gestures.
	 **/
	 var handleGestureEvents = function () {
		var gestures = Jazz.lastFrame.gestures;
		if (getCapturedDigits() > 0 && gestures.length > 0) {
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
	 *	getDetectedNav()
	 *
	 *  Determine hand position and capture timed navigation event
	 */
	var getDetectedNav = function () {
		var detectedNav = false;

		if (canDrawHandLeft())
			detectedNav = "left";
		else if (canDrawHandRight())
			detectedNav = "right";
		else if (canDrawHandUp())
			detectedNav = "up";
		else if (canDrawHandDown())
			detectedNav = "down";
		else if (canDrawZoomIn())
			detectedNav = "zoomIn";
		else if (canDrawZoomOut())
			detectedNav = "zoomOut";

		return detectedNav;
	}

	var handleGrabRelease = function() {
		if (Jazz.hands.length === 0) {
			if (Jazz.isGrabbing === true) {
				Jazz.isGrabbing=false;
				Jazz.event["release"]();
			}
			return;
		}
		// TODO: Surface this HACK (1 finger === grab)
		if (getCapturedDigits() <= 1) {
			
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
	var handleProgressNav = function(detectedNav) {
		if (Jazz.hands.length === 0) return;
		var verticalDistance = threshold("up") - threshold("down");
		var upProgress = (palm("vertical") -  threshold("down")) / verticalDistance;
		if (upProgress > 1) upProgress = 1;
		if (upProgress < 0) upProgress = 0;
		var downProgress = 1-upProgress;

		var horizontalDistance = threshold("right") - threshold("left");
		var rightProgress = (palm("horizontal") -  threshold("left")) / horizontalDistance;
		if (rightProgress > 1) rightProgress = 1;
		if (rightProgress < 0) rightProgress = 0;
		var leftProgress = 1-rightProgress;

		var depthDistance = threshold("zoomIn") - threshold("zoomOut");
		var zoomInProgress = (palm("depth") -  threshold("zoomOut")) / depthDistance;
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
	 * 	drawFingerText()
	 *
	 * 	Render a configured hoverText for a given finger
	 **/
	var drawFingerText = function () {
		if (Jazz.frameDigitCount === FIRST+1) {
			drawText(Jazz.fingersText[FIRST],getHandPosX(), getHandPosY());
		}
		else if (Jazz.frameDigitCount === SECOND+1) {
			drawText(Jazz.fingersText[SECOND],getHandPosX(), getHandPosY());
		}
		else if (Jazz.frameDigitCount === THIRD+1) {
			drawText(Jazz.fingersText[THIRD],getHandPosX(), getHandPosY());
		}
		else if (Jazz.frameDigitCount === FOURTH+1) {
			drawText(Jazz.fingersText[FOURTH],getHandPosX(), getHandPosY());
		}
	}

	/**
	 * 	drawTimerArc()
	 *
	 *	Render the timer arc to indicate an upcoming event
	 **/
	var drawTimerArc = function(fingerPos, percentage) {
		if (percentage < 5) {
			return;
		}

		radius = (percentage*0.01*2)*Math.PI;

		getContext().beginPath();
		getContext().arc(getXForCoords(fingerPos), getYForCoords(fingerPos), 30, 0, radius);
		getContext().lineWidth=10;
		getContext().strokeStyle="green";
		getContext().stroke();

		getBlurredContext().beginPath();
		getBlurredContext().arc(getXForCoords(fingerPos), getYForCoords(fingerPos), 30, 0, radius);
		getBlurredContext().lineWidth=10;
		getBlurredContext().strokeStyle="green";
		getBlurredContext().stroke();

	}

	/**
	 * 	clearTimeoutForDigits()
	 *
	 * 	Reset the timer, cancelling all upcoming "fingers" events
	 **/
	var clearTimeoutForDigits = function () {

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
	var setTimeoutForDigits = function () {
	    clearTimeoutForDigits();
	    
	    Jazz.intervalTimer = setInterval(function() {

	        Jazz.incr += Jazz.WAIT_INTERVAL_TIMER;

	        if (getTimerPercentage() > 100) {
	        	clearTimeout(Jazz.intervalTimer);
		        if (Jazz.hands.length > 0 && Jazz.lastDigitsFound < Jazz.LAST_VALID_FINGER) {
		        	Jazz.event["fingers"](getCapturedDigits());
		        }
	        }

	    }, Jazz.WAIT_INTERVAL_TIMER);
	}

	/**
	 * 	clearTimeoutForNav()
	 *
	 *	Reset the timer, cancelling all upcoming "navigation" events
	 **/
	var clearTimeoutForNav = function () {
		clearTimeout(Jazz.intervalTimer);
		Jazz.handNavigation = Jazz.incr = Jazz.timerPercentage = 0;
	}

	/**
	 * setTimeoutForNav()
	 *
	 *	Set the timer for an upcoming "navigation" event
	 **/	
	var setTimeoutForNav = function () {
	    clearTimeoutForNav();
	    
	    Jazz.intervalTimer = setInterval(function() {
	        Jazz.incr += Jazz.WAIT_INTERVAL_TIMER;

	        if (getTimerPercentage() > 100) {
	        	clearTimeout(Jazz.intervalTimer);
				if (Jazz.hands.length > 0) {
		        	Jazz.event["navigation"](Jazz.handNavigation);
		        	Jazz.lastHand = Jazz.handNavigation;
					Jazz.repeatNavInterval = setTimeout(function() {
						if (Jazz.handNavigation === Jazz.lastHand) {						
							clearTimeoutForNav();
							clearTimeout(Jazz.repeatNavInterval);
						}
					}, 900);
				}
			}
	    }, Jazz.WAIT_INTERVAL_TIMER);
	}

	/**
	 * 	drawText()
	 *
	 *	Render text at a given x,y coordinate
	 **/
	function drawText(txt, x, y) {
		if (txt) {
			getContext().clearRect(0,0,Jazz.canvas.width, Jazz.canvas.height);
			getContext().font='bold 22pt Arial';
		    
		    getContext().fillStyle = Jazz.fillStyle;
			getContext().strokeStyle = 'white';
			getContext().fillText(txt, x, y-30);


			getBlurredContext().clearRect(0,0,Jazz.canvas.width, Jazz.canvas.height);
			getBlurredContext().font='bold 22pt Arial';
		    
		    getBlurredContext().fillStyle = Jazz.fillStyle;
			getBlurredContext().strokeStyle = 'white';
			getBlurredContext().fillText(txt, x, y-30);
		}
	}


	/**
	 * 	createFingerCanvas()
	 *
	 * 	Create the canvas for rendering fingers and timers
	 **/
	var createFingerCanvas  = function () {
		var canvas = Jazz.canvas;
		getContext().translate(canvas.width*1.2,canvas.height);
	    getContext().globalAlpha = Jazz.opacity;
		var canvas = Jazz.blurredCanvas;
		getBlurredContext().translate(canvas.width*1.2,canvas.height);
	    getBlurredContext().globalAlpha = Jazz.opacity;
	}

	/**
	 *	clearCanvas()
	 **/
	var clearCanvas = function() {
		var canvas = Jazz.canvas;
		getContext().clearRect(-canvas.width*1.2,-canvas.height,canvas.width*1.2,canvas.height);
		getBlurredContext().clearRect(-canvas.width*1.2,-canvas.height,canvas.width*1.2,canvas.height);
	}

	/**
	 *	configureFromOptions()
	 *
	 * 	Available options:
	 *
	 *	waitTimer:
	 *	Time in milliseconds for timer before firing event:
	 * 
	 * 	fillStyle:
	 *	Color of the finger circle:
	 *	
	 *	fingersText:
	 *	Text to display for each "finger" event
	 *
	 *
	 *	Example usage during Jazz.init:
	 *	Jazz.init({
	 *		waitTimer:  100,
	 *		fillStyle: "black",
	 *		fingersText: ["finger one", "finger two"]	 
	 * 	})
	 *	
	 * TODO: document all available options	
	 *
	 **/
	var configureFromOptions = function(options) {
		Jazz.fillStyle = "black";
		Jazz.LAST_VALID_FINGER=1;
		setupImages();

		if (!options)
			return;

		if (options.fillStyle) {
			Jazz.arrowColor = Jazz.fillStyle = options.fillStyle;
		}
		if (options.waitTimer)
			Jazz.WAIT_FINGER_MS = options.waitTimer;
		
		if (options.fingersText) {
			Jazz.fingersText = Jazz.fingersText.concat(options.fingersText);
			Jazz.LAST_VALID_FINGER=options.fingersText.length+1;
		}
		if (Jazz.LAST_VALID_FINGER > 1)
			Jazz.simpleMode = false;
		else {
			Jazz.simpleMode=true;
		}

		if (options.disableTimer != undefined && options.disableTimer != Jazz.disableTimer)
			Jazz.disableTimer = options.disableTimer;

		if (options.disableZoom != undefined && options.disableZoom != Jazz.disableZoom)
			Jazz.disableZoom = options.disableZoom;

		if (options.disableHelper != undefined && options.disableHelper != Jazz.disableHelper)
			Jazz.disableHelper = options.disableHelper;

		if (options.disableFingers != undefined && options.disableFingers != Jazz.disableFingers)
			Jazz.disableFingers = options.disableFingers;

		if (options.opacity)
			Jazz.opacity = options.opacity;
		
	}
	/**
	 *	setupImages()
	 **/
	var setupImages = function () {
		// A bit experimental
		var jsFileLocation = $('script[src*=jzhands]').attr('src');
		jsFileLocation = jsFileLocation.replace('jzhands.js', ''); 
		var filePath = Jazz.filePath = jsFileLocation + "images/";

		Jazz.upArrow = new Image();
		Jazz.upArrow.src = filePath+Jazz.arrowColor+"_up_arrow.png"
		Jazz.downArrow = new Image();
		Jazz.downArrow.src = filePath+Jazz.arrowColor+"_down_arrow.png"
		Jazz.rightArrow = new Image();
		Jazz.rightArrow.src = filePath+Jazz.arrowColor+"_right_arrow.png"
		Jazz.leftArrow = new Image();
		Jazz.leftArrow.src = filePath+Jazz.arrowColor+"_left_arrow.png"
		Jazz.zoomIn = new Image();
		Jazz.zoomIn.src = filePath+Jazz.arrowColor+"_zoom_in.png"
		Jazz.zoomOut = new Image();
		Jazz.zoomOut.src = filePath+Jazz.arrowColor+"_zoom_out.png"

		setupHelperImages();
	}
	var setupHelperImages = function () {
		// A bit experimental
		var jsFileLocation = $('script[src*=jzhands]').attr('src');
		jsFileLocation = jsFileLocation.replace('jzhands.js', ''); 
		var filePath = Jazz.filePath = jsFileLocation + "images/";

		Jazz.upHelperArrow = new Image();
		Jazz.upHelperArrow.src = filePath+"gray_up_arrow.png"
		Jazz.downHelperArrow = new Image();
		Jazz.downHelperArrow.src = filePath+"gray_down_arrow.png"
		Jazz.rightHelperArrow = new Image();
		Jazz.rightHelperArrow.src = filePath+"gray_right_arrow.png"
		Jazz.leftHelperArrow = new Image();
		Jazz.leftHelperArrow.src = filePath+"gray_left_arrow.png"
	}

	/**
	 *	threshold()
	 */
	var threshold = function (direction) {
		if (direction === "zoomIn")
			return -10;
		else if (direction === "zoomOut")
			return 120;
		else if (direction === "up")
			return 225;
		else if (direction === "down")
			return 90;
		else if (direction === "left")
			return -80;
		else if (direction === "right")
			return 80;
	}

	/**
	 *	getContext()
	 **/
	var getContext = function (isBlurred) {
		if (Jazz.ctx)  return Jazz.ctx;
		Jazz.ctx = Jazz.canvas.getContext("2d");
		return Jazz.ctx;
	}
	var getBlurredContext = function () {
		if (Jazz.blurredCtx) return Jazz.blurredCtx;
		Jazz.blurredCtx = Jazz.blurredCanvas.getContext("2d");
		return Jazz.blurredCtx;
	}
	/**
	 *	getFingersMap()
	 **/
	var getFingersMap = function (key) {
		if (Jazz.lastFrame.pointablesMap) {
			if (key)
				return Jazz.lastFrame.pointablesMap[key];
			else
				return Jazz.lastFrame.pointablesMap;
		}
		return undefined;
	}
	var getFinger = function (key) {
		return getFingersMap(key);
	}
	// TODO: rename methods since this is no longer for finger, but hand pos AND finger
	var getRadiusForFinger = function (coords) {
		return Math.min(600/Math.abs(coords[2]),20) * Jazz.CIRCLE_RADIUS;
	}
	var getYForCoords = function (coords) {
		return (-coords[1]-120)-getRadiusForFinger(coords)/2;
	}
	var getXForCoords = function (coords) {
		return parseInt((coords[0]-900)-getRadiusForFinger(coords)/2);
	}
	var drawCircle = function(coords) {

		if (Jazz.timerPercentage === 0){
			getContext().beginPath();
			getContext().arc(getXForCoords(coords), getYForCoords(coords), getRadiusForFinger(coords), 0, 2*Math.PI);
			getContext().fill();

			getBlurredContext().beginPath();
			getBlurredContext().arc(getXForCoords(coords), getYForCoords(coords), getRadiusForFinger(coords), 0, 2*Math.PI);
			getBlurredContext().fill();
		}
	}

	var getCapturedDigits = function() {
		return Jazz.frameDigitCount;
	}
	var isNewFingerCount = function () {
		return ((getCapturedDigits() === 0) || Jazz.lastDigitsFound !== getCapturedDigits())
	}
	var isHoldingFinger = function() {
		return (getCapturedDigits() > 0 && isNewFingerCount() == true);
	}
	var isValidFinger = function () {
		return (getCapturedDigits() > 0 && getCapturedDigits() <= Jazz.LAST_VALID_FINGER);
	}
	var isHoldingValidFinger = function () {
		return (isHoldingFinger() && isValidFinger()) === true;
	}
	var hasDetectedHand = function() {
		return Jazz.hands.length > 0;
	}
	var isNewHandMotion = function () {
		return (Jazz.handNavigation !== getDetectedNav());
	}
	var getFirstFingerPos = function() {
		for (var i in getFingersMap()) {
			return getFingersMap(i).tipPosition;
		}
	}
	var getHandPos = function(indx) {
		if ( Jazz.hands.length <= 0)
			return;

		if (indx === 0)
			return getXForCoords(Jazz.hands[0].palmPosition);
		else
			return getYForCoords(Jazz.hands[0].palmPosition);
	}
	var getHandPosX = function() {
		return getHandPos(0);
	}
	var getHandPosY = function() {
		return getHandPos(1);
	}
	var palm = function(palmPosition) {
		if (Jazz.hands.length === 0) return;
		var hand = Jazz.hands[0];
		if (palmPosition === "horizontal")
			return hand.palmPosition[0];
		else if (palmPosition === "vertical")
			return hand.palmPosition[1];
		else if (palmPosition === "depth")
		 	return hand.palmPosition[2];
	}
	var drawHelperArrows = function () {
		getContext().drawImage(Jazz.upHelperArrow, getHandPosX()-17, -390);
		getContext().drawImage(Jazz.rightHelperArrow, -820, getHandPosY()-15);
		getContext().drawImage(Jazz.leftHelperArrow, -1030, getHandPosY()-15);
		getContext().drawImage(Jazz.downHelperArrow, getHandPosX()-17, -215);

		getBlurredContext().drawImage(Jazz.upHelperArrow, getHandPosX()-17, -390);
		getBlurredContext().drawImage(Jazz.rightHelperArrow, -820, getHandPosY()-15);
		getBlurredContext().drawImage(Jazz.leftHelperArrow, -1030, getHandPosY()-15);
		getBlurredContext().drawImage(Jazz.downHelperArrow, getHandPosX()-17, -215);
	}
	var drawUpArrow = function () {
		getContext().drawImage(Jazz.upArrow, getHandPosX()-17, getHandPosY()-15);
		getBlurredContext().drawImage(Jazz.upArrow, getHandPosX()-17, getHandPosY()-15);
	}
	var drawDownArrow = function () {
		getContext().drawImage(Jazz.downArrow, getHandPosX()-17, getHandPosY()-15);
		getBlurredContext().drawImage(Jazz.downArrow, getHandPosX()-17, getHandPosY()-15);
	}
	var drawLeftArrow = function () { 
		getContext().drawImage(Jazz.leftArrow, getHandPosX()-17, getHandPosY()-15);
		getContext().drawImage(Jazz.leftArrow, getHandPosX()-17, getHandPosY()-15);
	}
	var drawRightArrow = function () {
		getContext().drawImage(Jazz.rightArrow, getHandPosX()-14, getHandPosY()-15);
		getBlurredContext().drawImage(Jazz.rightArrow, getHandPosX()-14, getHandPosY()-15);
	}
	var drawZoomInIcon = function () {
		getContext().drawImage(Jazz.zoomIn, getHandPosX()-24, getHandPosY()-20);
		getBlurredContext().drawImage(Jazz.zoomIn, getHandPosX()-24, getHandPosY()-20);
	}
	var drawZoomOutIcon = function () {
		getContext().drawImage(Jazz.zoomOut, getHandPosX()-19, getHandPosY()-20);
		getBlurredContext().drawImage(Jazz.zoomOut, getHandPosX()-19, getHandPosY()-20);
	}
	var canDrawHandUp = function () {
		if (palm("vertical") > threshold("up")) {
			drawUpArrow();
			return true;
		} else
			return false;
	}
	var canDrawHandDown = function () {
		if (palm("vertical") < threshold("down")) {
			drawDownArrow();
			return true;
		} else
			return false;
	}
	var canDrawHandLeft = function () {
		if (palm("horizontal") < threshold("left")) {
			drawLeftArrow();
			return true;
		} else
			return false;
	}
	var canDrawHandRight = function() {
		if (palm("horizontal") > threshold("right")) {
			drawRightArrow();
			return true;
		} else
			return false;
	}
	var canDrawZoomIn = function() {
		if (palm("depth") < threshold("zoomIn")) {
			if (Jazz.disableZoom === false) {
				drawZoomInIcon();
				return true;
			}
		}
		return false;
	}
	var canDrawZoomOut = function() {
		if (palm("depth") > threshold("zoomOut")) {
			if (Jazz.disableZoom === false) {
				drawZoomOutIcon();
				return true;
			}
		}
		return false;
	}
	var getTimerPercentage = function() {
		Jazz.timerPercentage = parseInt ((Jazz.incr / Jazz.WAIT_FINGER_MS) * 100);
		return Jazz.timerPercentage;
	}

	var appendCanvasToDOM = function (){
		var canvas = createBaseCanvas(false,"jazz-fingers");
		var blurredCanvas = createBaseCanvas(true,"jazz-fingers-shadow");
		Jazz.blurredCanvas = blurredCanvas;
		document.body.appendChild(blurredCanvas);
		document.body.appendChild(canvas);

		return canvas;
	}

	var createBaseCanvas = function (isBlurred, divId) {
		var canvas = document.createElement("canvas");
		var calculatedWidth = document.body.clientWidth*.9;
		var cssStyle = "position:absolute;top:105px;left:-25px;"
		if (calculatedWidth < 1000) calculatedWidth = 1050;
		if (isBlurred) cssStyle+=blurStyle();

		canvas.setAttribute("id", divId);
		canvas.setAttribute("style",cssStyle);

		canvas.setAttribute("width", calculatedWidth+"px");
		canvas.setAttribute("height", "410px");

		return canvas;
	}

	var blurStyle = function () {
		return "-webkit-filter: blur(10px);-moz-filter: blur(10px);-o-filter: blur(10px);-ms-filter: blur(10px)filter: blur(10px);";
	}
	var showCanvas = function () {
		if (Jazz.showUI === true) {
			document.getElementById("jazz-fingers").style.display = 'block';
			document.getElementById("jazz-fingers-shadow").style.display = 'block';
		}
	}
	var hideCanvas = function () {
		document.getElementById("jazz-fingers").style.display = 'none';
		document.getElementById("jazz-fingers-shadow").style.display = 'none';
	}

	Jazz.event = {
		finger: function(numberOfFingers){},
		navigation: function(navEvent){},
		gestures: function(nativeGesture){},
		frames: function(nativeFrame){},
		progress: function(navProgress){},
		grab: function(){},
		release: function(){}
	}
	Jazz.lastDigitsFound = 0;
	Jazz.handNavigation = "";
	Jazz.WAIT_FINGER_MS = 700;
	Jazz.LAST_VALID_FINGER = 2;
	Jazz.WAIT_INTERVAL_TIMER = 40;
	Jazz.CIRCLE_RADIUS = 1.6;
	Jazz.opacity = .45;
	Jazz.fingersText = [];
	Jazz.arrowColor = "black"
	Jazz.incr=0;
	Jazz.lastFrame = {};
	Jazz.hands = [];
	Jazz.timerPercentage = 0;
	Jazz.simpleMode = true;
	Jazz.disableZoom = false;
	Jazz.disableHelper = false;
	Jazz.disableTimer = false;
	Jazz.disableFingers = false;
	Jazz.showUI = true;
	Jazz.isGrabbing = false;
	var FIRST=0, SECOND=1, THIRD=2, FOURTH=3;

}).call(this);