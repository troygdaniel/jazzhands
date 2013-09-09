//     jshands.js 0.4 Alpha

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
	Jazz.VERSION = '0.4';

	/**
	 * Jazz.init()
	 * 
	 * Initialize all that Jazz 
	 */
	Jazz.init = function (options, callback) {		

		Jazz.canvas = appendCanvasToDOM(); //document.getElementById(options.canvas);
		configureFromOptions(options);
		createFingerCanvas();

		Leap.loop(function(frame) { Jazz.loop(frame); })

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
		else
			hideCanvas();

		Jazz.frameDigitCount = frame.pointables.length;

		updateCanvas();

		// DYNAMICALLY SWITCH from simple mode
		// are we holding up more than last_valid fingers?
		if (Jazz.frameDigitCount >= Jazz.LAST_VALID_FINGER)
			Jazz.simpleMode = true;
		else
			Jazz.simpleMode = false;

		if (Jazz.simpleMode===false)
			handleCapturedFingers();

		handleCapturedNavigation();
		// handleGestureEvents();		// Currently not working?
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

		// render circles based on pointable positions
		for (var i in getFingersMap()) {

			var isLastFinger = (++fIndex === Jazz.lastFrame.fingers.length);
			var canDrawFingerText = (Jazz.timerPercentage > 10 && isLastFinger);

			drawFinger(getFinger(i).tipPosition);
			drawTimerArc(getFinger(i).tipPosition, Jazz.timerPercentage);

			if (canDrawFingerText) 
				drawFingerText();

			if (Jazz.simpleMode === true)
				return;
		}
	}

	/**
	 * handleCapturedNavigation()
	 *
	 * Initate a timer and eventually trigger the "navigation" event.
	 * Event callbacks are bound by Jazz.on("navigation") 
	 *
	 * Determine if a pointable (finger) is being held in a "hot spot"
	 * and reset or start a timer before calling the bound callback method.
	 *	 
	 **/
	var handleCapturedNavigation = function () {

		if (getCapturedDigits() < Jazz.LAST_VALID_FINGER)
			return false;

		if (hasDetectedHand() === true) {
			if (isNewHandMotion() === true)
				setTimeoutForMotion();

			if (getDetectedNav() === false)
			 	clearTimeoutForNav();

			Jazz.handNavigation = getDetectedNav();
		}
	}

	/**
	 * handleCapturedFingers()
	 *
	 * Initate a timer and eventually trigger the "finger" event.
	 * Event callbacks are bound by Jazz.on("finger") 
	 *
	 * Determine if a new finger count is found, 
	 * and reset or start the timer for the fingers being held.
	 **/
	var handleCapturedFingers = function () {

		if (isNewFingerCount()) 
			clearTimeoutForDigits();
		
		if (isHoldingValidFinger()) 
			setTimeoutForDigits();
		
		Jazz.lastDigitsFound = getCapturedDigits();
	}

	/** 
	 * 	handleGestureEvents()
	 *
	 *  Allow binding to the Jazz.on("gesture") event
	 *  to simplify the callback for LEAP generated gestures.
	 **/
	 var handleGestureEvents = function () {
		var gestures = Jazz.lastFrame.gestures;
		if (getCapturedDigits() > 0 && gestures.length > 0) {
			Jazz.event["gestures"](gestures);
		}
	 }

	/**
	 *	getDetectedNav()
	 *
	 *  Determine hand position and capture timed navigation event
	 */
	var getDetectedNav = function () {
		var detectedNav = false;

		if (canDrawHandUp())
			detectedNav = "up";
		else if (canDrawHandDown())
			detectedNav = "down";
		else if (canDrawHandLeft())
			detectedNav = "left";
		else if (canDrawHandRight())
			detectedNav = "right";
		else if (canDrawZoomIn())
			detectedNav = "zoomIn";
		else if (canDrawZoomOut())
			detectedNav = "zoomOut";

		return detectedNav;
	}

	/**
	 * 	drawFinger(fingerPos, isLastFinger)
	 *
	 * 	Draw a circle representing captured fingers
	 **/
	var drawFinger = function(fingerPos) {

		if (Jazz.timerPercentage > 99) {
			getContext().fillStyle = "green";
		}
		else if (Jazz.timerPercentage === 0) {
			getContext().fillStyle = Jazz.fillStyle;
			drawCircle(fingerPos);
		}
	}

	/**
	 * 	drawFingerText()
	 *
	 * 	Render a configured hoverText for a given finger
	 **/
	var drawFingerText = function () {
		if (Jazz.frameDigitCount === FIRST+1) {
			drawText(Jazz.fingersHoverText[FIRST],getHandPosX(), getHandPosY());
		}
		else if (Jazz.frameDigitCount === SECOND+1) {
			drawText(Jazz.fingersHoverText[SECOND],getHandPosX(), getHandPosY());
		}
		else if (Jazz.frameDigitCount === THIRD+1) {
			drawText(Jazz.fingersHoverText[THIRD],getHandPosX(), getHandPosY());
		}
		else if (Jazz.frameDigitCount === FOURTH+1) {
			drawText(Jazz.fingersHoverText[FOURTH],getHandPosX(), getHandPosY());
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
		getContext().arc(getXforFinger(fingerPos), getYForFinger(fingerPos), 30, 0, radius);
		getContext().lineWidth=10;
		getContext().strokeStyle="green";
		getContext().stroke();
	}

	/**
	 * 	clearTimeoutForDigits()
	 *
	 * 	Reset the timer, cancelling all upcoming "finger" events
	 **/
	var clearTimeoutForDigits = function () {

		if (Jazz.frameDigitCount > 0) {
			clearTimeout(Jazz.intervalTimer);
			Jazz.incr = Jazz.timerPercentage = 0;
		}
	}

	/**
	 * 	setTimeoutForDigits()
	 *
	 *	Set the timer for an upcoming "finger" event
	 **/	
	var setTimeoutForDigits = function () {
	    clearTimeoutForDigits();
	    
	    Jazz.intervalTimer = setInterval(function() {

	        Jazz.incr += Jazz.WAIT_INTERVAL_TIMER;

	        if (getTimerPercentage() > 100) {
	        	clearTimeout(Jazz.intervalTimer);
		        if (Jazz.hands.length > 0 && Jazz.lastDigitsFound < Jazz.LAST_VALID_FINGER)
		        	Jazz.event["finger"](getCapturedDigits());
	        }

	    }, Jazz.WAIT_INTERVAL_TIMER);		
	}

	/**
	 * 	clearTimeoutForNav()
	 *
	 *	Reset the timer, cancelling all upcoming "navigtation" events
	 **/
	var clearTimeoutForNav = function () {
		clearTimeout(Jazz.intervalTimer);
		Jazz.incr = Jazz.timerPercentage = 0;
	}

	/**
	 * setTimeoutForMotion()
	 *
	 *	Set the timer for an upcoming "navigation" event
	 **/	
	var setTimeoutForMotion = function () {
	    clearTimeoutForNav();
	    
	    Jazz.intervalTimer = setInterval(function() {
	        Jazz.incr += Jazz.WAIT_INTERVAL_TIMER;

	        if (getTimerPercentage() > 100) {
	        	clearTimeout(Jazz.intervalTimer);
	        	if (Jazz.hands.length > 0)
		        	Jazz.event["navigation"](Jazz.handNavigation);
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
			getContext().fillText(txt, x, y-30);
		}
	}


	/**
	 * 	createFingerCanvas()
	 *
	 * 	Create the canvas for rendering fingers and timers
	 **/
	var createFingerCanvas  = function () {
		var canvas = Jazz.canvas;

		canvas.width = document.body.clientWidth;
		canvas.height = document.body.clientHeight;
		if (canvas.height > 500)
			canvas.height=500;		
		getContext().translate(canvas.width,canvas.height);
	    getContext().globalAlpha = Jazz.opacity;	    
	}

	/**
	 *	clearCanvas()
	 **/
	var clearCanvas = function() {
		var canvas = Jazz.canvas;
		getContext().clearRect(-canvas.width,-canvas.height,canvas.width,canvas.height);
	}

	/**
	 *	configureFromOptions()
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
			Jazz.WAIT_FINGER_MS = options.fingerWaitTimer;
		
		if (options.fingersHoverText) {
			Jazz.fingersHoverText = Jazz.fingersHoverText.concat(options.fingersHoverText);
			Jazz.LAST_VALID_FINGER=options.fingersHoverText.length+1;
		}
		if (Jazz.LAST_VALID_FINGER > 1)
			Jazz.simpleMode = false;
		else {
			Jazz.simpleMode=true;
			Jazz.CIRCLE_RADIUS=1;
			Jazz.WAIT_FINGER_MS = 1200;			
		}
		if (options.disableZoom)
			Jazz.disableZoom = true;

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
	}
	/**
	 *	threshold()
	 */
	var threshold = function (direction) {
		if (direction === "up") 
			return 200;
		else if (direction === "down")
			return 100;
		else if (direction === "left")
			return  -50;
		else if (direction === "right")
			return 50;
		else if (direction === "zoomIn") {
			if (Jazz.simpleMode)
				return 0;
			else
				return 25;
		}
		else if (direction === "zoomOut") {
			if (Jazz.simpleMode)
				return 100;
			else
				return 160;
		}
	}

	/**
	 *	getContext()
	 **/
	var getContext = function () {
		if (Jazz.ctx) 
			return Jazz.ctx;
		else
			Jazz.ctx = Jazz.canvas.getContext("2d");
		return Jazz.ctx;
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
	var getRadiusForFinger = function (fingerPos) {
		return Math.min(600/Math.abs(fingerPos[2]),20) * Jazz.CIRCLE_RADIUS;
	}
	var getYForFinger = function (fingerPos) {
		return parseInt((-fingerPos[1]-100)-getRadiusForFinger(fingerPos)/2);
	}
	var getXforFinger = function (fingerPos) {
		return parseInt((fingerPos[0]-900)-getRadiusForFinger(fingerPos)/2);
	}
	var drawCircle = function(fingerPos) {
		getContext().beginPath();
		getContext().arc(getXforFinger(fingerPos), getYForFinger(fingerPos), getRadiusForFinger(fingerPos), 0, 2*Math.PI);
		getContext().fill();		
	}
	var getYForFinger = function(fingerPos) {
		return (-fingerPos[1]-100)-getRadiusForFinger(fingerPos)/2;
	}
	var getCapturedDigits = function() {
		// if (Jazz.simpleMode === true && Jazz.frameDigitCount > 0)
		// 	return 1;
		// else
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
		if (indx === 0)
			return getXforFinger(getFirstFingerPos());
		else
			return getYForFinger(getFirstFingerPos());
	}
	var getHandPosX = function() {
		return getHandPos(0);
	}
	var getHandPosY = function() {
		return getHandPos(1);
	}
	var palm = function(palmPosition) {
		var hand = Jazz.hands[0];
		if (palmPosition === "horizontal")
			return hand.palmPosition[0];
		else if (palmPosition === "vertical")
			return hand.palmPosition[1];
		else if (palmPosition === "depth")
		 	return hand.palmPosition[2];
	}
	var drawUpArrow = function () {
		getContext().drawImage(Jazz.upArrow, getHandPosX()-17, getHandPosY()-15);
	}
	var drawDownArrow = function () {
		getContext().drawImage(Jazz.downArrow, getHandPosX()-17, getHandPosY()-15);
	}
	var drawLeftArrow = function () { 
		getContext().drawImage(Jazz.leftArrow, getHandPosX()-17, getHandPosY()-15);
	}
	var drawRightArrow = function () {
		getContext().drawImage(Jazz.rightArrow, getHandPosX()-14, getHandPosY()-15);
	}
	var drawZoomInIcon = function () {
		getContext().drawImage(Jazz.zoomIn, getHandPosX()-24, getHandPosY()-20);
	}
	var drawZoomOutIcon = function () {
		getContext().drawImage(Jazz.zoomOut, getHandPosX()-19, getHandPosY()-20);
	}
	var canDrawHandUp = function () {
		if (palm("vertical") > threshold("up")) {
			drawUpArrow();
			return true;
		} else
			return false
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
		var canvas = document.createElement("canvas");
		canvas.setAttribute("id", "jazz-fingers");
		canvas.setAttribute("style","position:absolute;top:100px;left:0px");
		canvas.setAttribute("height", document.height);
		canvas.setAttribute("width", document.width);
		document.body.appendChild(canvas);
		return canvas;
	}
	var showCanvas = function () {
		document.getElementById("jazz-fingers").style.display = 'block';
	}
	var hideCanvas = function () {
		document.getElementById("jazz-fingers").style.display = 'none';
	}

	Jazz.event = {
		finger: function(n){},
		navigation: function(n){},
		gestures: function(n){}
	}
	Jazz.lastDigitsFound = 0;
	Jazz.handNavigation = "";
	Jazz.WAIT_FINGER_MS = 1000;
	Jazz.LAST_VALID_FINGER = 2;
	Jazz.WAIT_INTERVAL_TIMER = 40;
	Jazz.CIRCLE_RADIUS = .8;
	Jazz.opacity = .65;
	Jazz.fingersHoverText = [];
	Jazz.arrowColor = "black"
	Jazz.incr=0;
	Jazz.lastFrame = {};
	Jazz.hands = [];
	Jazz.timerPercentage = 0;
	Jazz.simpleMode = true;
	Jazz.disableZoom = false;
	
	var FIRST=0, SECOND=1, THIRD=2, FOURTH=3;

}).call(this);