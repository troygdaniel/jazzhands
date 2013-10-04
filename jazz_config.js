function JazzConfig() {

	this.configureFromOptions = function(options) {
		Jazz.fillStyle = "black";
		Jazz.LAST_VALID_FINGER=1;
		this.setupImages();

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
	this.setupImages = function () {
		// A bit experimental
		var jsFileLocation = $('script[src*=jazz]').attr('src');
		jsFileLocation = jsFileLocation.replace('jazz.js', ''); 
		var jsPath = jsFileLocation.substring(0,jsFileLocation.indexOf("jazz"))
		var filePath = Jazz.filePath = jsPath + "images/";

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

		this.setupHelperImages();
	}
	this.setupHelperImages = function () {
		// A bit experimental
		var jsFileLocation = $('script[src*=jazz]').attr('src');
		jsFileLocation = jsFileLocation.replace('jazz.js', ''); 
		var jsPath = jsFileLocation.substring(0,jsFileLocation.indexOf("jazz"))
		var filePath = Jazz.filePath = jsPath + "images/";

		Jazz.upHelperArrow = new Image();
		Jazz.upHelperArrow.src = filePath+"gray_up_arrow.png"
		Jazz.downHelperArrow = new Image();
		Jazz.downHelperArrow.src = filePath+"gray_down_arrow.png"
		Jazz.rightHelperArrow = new Image();
		Jazz.rightHelperArrow.src = filePath+"gray_right_arrow.png"
		Jazz.leftHelperArrow = new Image();
		Jazz.leftHelperArrow.src = filePath+"gray_left_arrow.png"
	}
	this.threshold = function (direction) {
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
	Jazz.isReady = false;
	Jazz.FIRST=0, Jazz.SECOND=1, Jazz.THIRD=2, Jazz.FOURTH=3;

}