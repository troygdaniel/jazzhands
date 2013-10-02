(function(){

	// Save a reference to the global object
	var root = this;
	var JazzUI;
	if (typeof exports !== 'undefined') { JazzUI = exports; } else { JazzUI = root.JazzUI = {}; }
	console.log("Loaded JazzUI.")

	/**	
	 * 	createFingerCanvas()
	 *
	 * 	Create the canvas for rendering fingers and timers
	 **/
	JazzUI.createFingerCanvas  = function () {
		var canvas = Jazz.canvas;
		JazzUI.getContext().translate(canvas.width*1.2,canvas.height);
	    JazzUI.getContext().globalAlpha = Jazz.opacity;
		var canvas = Jazz.blurredCanvas;
		JazzUI.getBlurredContext().translate(canvas.width*1.2,canvas.height);
	    JazzUI.getBlurredContext().globalAlpha = Jazz.opacity;
	}

	// TODO: document these functions
	JazzUI.show = function () {
		Jazz.showUI = true;
	}
	JazzUI.hide = function () {
		Jazz.showUI = false;
	}

	JazzUI.clearFingersText = function () {
		Jazz.fingersText = [];
		Jazz.disableFingers=false;
		Jazz.LAST_VALID_FINGER = 1;
	}

	JazzUI.showCanvas = function () {
		if (Jazz.showUI === true) {
			document.getElementById("jazz-fingers").style.display = 'block';
			document.getElementById("jazz-fingers-shadow").style.display = 'block';
		}
	}
	JazzUI.hideCanvas = function () {
		document.getElementById("jazz-fingers").style.display = 'none';
		document.getElementById("jazz-fingers-shadow").style.display = 'none';
	}
	/**
	 * updateCanvas()
	 *
	 * Update the canvas with the fingers and timer circles
	 **/
	JazzUI.updateCanvas = function () {

		JazzUI.clearCanvas();
		var fIndex=0;
		// Build a grid for the jazz-hands canvas
		// render circles based on pointable positions
		for (var i in JazzHands.getFingersMap()) {

			var isLastFinger = (++fIndex === Jazz.lastFrame.fingers.length);
			var canDrawFingerText = (Jazz.timerPercentage > 10 && isLastFinger);
			var circleCoords = JazzHands.getFinger(i).tipPosition;

			if (Jazz.simpleMode === true && Jazz.hands.length > 0) {
				circleCoords = Jazz.hands[0].palmPosition;
			}

			JazzUI.drawCircle(circleCoords);

			if (Jazz.disableHelper === false) {
				JazzUI.drawHelperArrows();
			}

			if (Jazz.disableTimer === false)
				JazzUI.drawTimerArc(circleCoords, Jazz.timerPercentage);

			if (canDrawFingerText && Jazz.disableFingers === false) 
				JazzUI.drawFingerText();

			if (Jazz.simpleMode === true)
				return;
		}

	}

	JazzUI.setFingersText = function(hoverText) {
		if (hoverText) {
			Jazz.fingersText = hoverText;
			Jazz.disableFingers=false;
			Jazz.LAST_VALID_FINGER = hoverText.length+1;
		} else {
			Jazz.clearFingersText();
		}
	}
	/**
	 *	clearCanvas()
	 **/
	JazzUI.clearCanvas = function() {
		var canvas = Jazz.canvas;
		JazzUI.getContext().clearRect(-canvas.width*1.2,-canvas.height,canvas.width*1.2,canvas.height);
		JazzUI.getBlurredContext().clearRect(-canvas.width*1.2,-canvas.height,canvas.width*1.2,canvas.height);
	}

	JazzUI.drawCircle = function(coords) {

		if (Jazz.timerPercentage === 0){
			JazzUI.getContext().beginPath();
			JazzUI.getContext().arc(JazzHands.getXForCoords(coords), JazzHands.getYForCoords(coords), JazzHands.getRadiusForFinger(coords), 0, 2*Math.PI);
			JazzUI.getContext().fill();

			JazzUI.getBlurredContext().beginPath();
			JazzUI.getBlurredContext().arc(JazzHands.getXForCoords(coords), JazzHands.getYForCoords(coords), JazzHands.getRadiusForFinger(coords), 0, 2*Math.PI);
			JazzUI.getBlurredContext().fill();
		}
	}

	JazzUI.drawHelperArrows = function () {
		JazzUI.getContext().drawImage(Jazz.upHelperArrow, JazzHands.getHandPosX()-17, -390);
		JazzUI.getContext().drawImage(Jazz.rightHelperArrow, -820, JazzHands.getHandPosY()-15);
		JazzUI.getContext().drawImage(Jazz.leftHelperArrow, -1030, JazzHands.getHandPosY()-15);
		JazzUI.getContext().drawImage(Jazz.downHelperArrow, JazzHands.getHandPosX()-17, -215);

		JazzUI.getBlurredContext().drawImage(Jazz.upHelperArrow, JazzHands.getHandPosX()-17, -390);
		JazzUI.getBlurredContext().drawImage(Jazz.rightHelperArrow, -820, JazzHands.getHandPosY()-15);
		JazzUI.getBlurredContext().drawImage(Jazz.leftHelperArrow, -1030, JazzHands.getHandPosY()-15);
		JazzUI.getBlurredContext().drawImage(Jazz.downHelperArrow, JazzHands.getHandPosX()-17, -215);
	}
	JazzUI.drawUpArrow = function () {
		JazzUI.getContext().drawImage(Jazz.upArrow, JazzHands.getHandPosX()-17, JazzHands.getHandPosY()-15);
		JazzUI.getBlurredContext().drawImage(Jazz.upArrow, JazzHands.getHandPosX()-17, JazzHands.getHandPosY()-15);
	}
	JazzUI.drawDownArrow = function () {
		JazzUI.getContext().drawImage(Jazz.downArrow, JazzHands.getHandPosX()-17, JazzHands.getHandPosY()-15);
		JazzUI.getBlurredContext().drawImage(Jazz.downArrow, JazzHands.getHandPosX()-17, JazzHands.getHandPosY()-15);
	}
	JazzUI.drawLeftArrow = function () { 
		JazzUI.getContext().drawImage(Jazz.leftArrow, JazzHands.getHandPosX()-17, JazzHands.getHandPosY()-15);
		JazzUI.getContext().drawImage(Jazz.leftArrow, JazzHands.getHandPosX()-17, JazzHands.getHandPosY()-15);
	}
	JazzUI.drawRightArrow = function () {
		JazzUI.getContext().drawImage(Jazz.rightArrow, JazzHands.getHandPosX()-14, JazzHands.getHandPosY()-15);
		JazzUI.getBlurredContext().drawImage(Jazz.rightArrow, JazzHands.getHandPosX()-14, JazzHands.getHandPosY()-15);
	}
	JazzUI.drawZoomInIcon = function () {
		JazzUI.getContext().drawImage(Jazz.zoomIn, JazzHands.getHandPosX()-24, JazzHands.getHandPosY()-20);
		JazzUI.getBlurredContext().drawImage(Jazz.zoomIn, JazzHands.getHandPosX()-24, JazzHands.getHandPosY()-20);
	}
	JazzUI.drawZoomOutIcon = function () {
		JazzUI.getContext().drawImage(Jazz.zoomOut, JazzHands.getHandPosX()-19, JazzHands.getHandPosY()-20);
		JazzUI.getBlurredContext().drawImage(Jazz.zoomOut, JazzHands.getHandPosX()-19, JazzHands.getHandPosY()-20);
	}
	JazzUI.canDrawHandUp = function () {
		if (JazzHands.palm("vertical") > JazzConfig.threshold("up")) {
			JazzUI.drawUpArrow();
			return true;
		} else
			return false;
	}
	JazzUI.canDrawHandDown = function () {
		if (JazzHands.palm("vertical") < JazzConfig.threshold("down")) {
			JazzUI.drawDownArrow();
			return true;
		} else
			return false;
	}
	JazzUI.canDrawHandLeft = function () {
		if (JazzHands.palm("horizontal") < JazzConfig.threshold("left")) {
			JazzUI.drawLeftArrow();
			return true;
		} else
			return false;
	}
	JazzUI.canDrawHandRight = function() {
		if (JazzHands.palm("horizontal") > JazzConfig.threshold("right")) {
			JazzUI.drawRightArrow();
			return true;
		} else
			return false;
	}
	JazzUI.canDrawZoomIn = function() {
		if (JazzHands.palm("depth") < JazzConfig.threshold("zoomIn")) {
			if (Jazz.disableZoom === false) {
				JazzUI.drawZoomInIcon();
				return true;
			}
		}
		return false;
	}
	JazzUI.canDrawZoomOut = function() {
		if (JazzHands.palm("depth") > JazzConfig.threshold("zoomOut")) {
			if (Jazz.disableZoom === false) {
				JazzUI.drawZoomOutIcon();
				return true;
			}
		}
		return false;
	}


	JazzUI.appendCanvasToDOM = function (){
		var canvas = JazzUI.createBaseCanvas(false,"jazz-fingers");
		var blurredCanvas = JazzUI.createBaseCanvas(true,"jazz-fingers-shadow");
		Jazz.blurredCanvas = blurredCanvas;
		document.body.appendChild(blurredCanvas);
		document.body.appendChild(canvas);

		return canvas;
	}

	JazzUI.createBaseCanvas = function (isBlurred, divId) {
		var canvas = document.createElement("canvas");
		var calculatedWidth = document.body.clientWidth*.9;
		var cssStyle = "position:absolute;top:105px;left:-25px;"
		if (calculatedWidth < 1000) calculatedWidth = 1050;
		if (isBlurred) cssStyle+=JazzUI.blurStyle();

		canvas.setAttribute("id", divId);
		canvas.setAttribute("style",cssStyle);

		canvas.setAttribute("width", calculatedWidth+"px");
		canvas.setAttribute("height", "410px");

		return canvas;
	}

	JazzUI.blurStyle = function () {
		return "-webkit-filter: blur(10px);-moz-filter: blur(10px);-o-filter: blur(10px);-ms-filter: blur(10px)filter: blur(10px);";
	}

	/**
	 * 	JazzUI.drawText()
	 *
	 *	Render text at a given x,y coordinate
	 **/
	JazzUI.drawText = function (txt, x, y) {
		if (txt) {
			JazzUI.getContext().clearRect(0,0,Jazz.canvas.width, Jazz.canvas.height);
			JazzUI.getContext().font='bold 22pt Arial';
		    
		    JazzUI.getContext().fillStyle = Jazz.fillStyle;
			JazzUI.getContext().strokeStyle = 'white';
			JazzUI.getContext().fillText(txt, x, y-30);


			JazzUI.getBlurredContext().clearRect(0,0,Jazz.canvas.width, Jazz.canvas.height);
			JazzUI.getBlurredContext().font='bold 22pt Arial';
		    
		    JazzUI.getBlurredContext().fillStyle = Jazz.fillStyle;
			JazzUI.getBlurredContext().strokeStyle = 'white';
			JazzUI.getBlurredContext().fillText(txt, x, y-30);
		}
	}

	JazzUI.getTimerPercentage = function() {
		Jazz.timerPercentage = parseInt ((Jazz.incr / Jazz.WAIT_FINGER_MS) * 100);
		return Jazz.timerPercentage;
	}


	/**
	 * 	drawFingerText()
	 *
	 * 	Render a configured hoverText for a given finger
	 **/
	JazzUI.drawFingerText = function () {
		if (Jazz.frameDigitCount === Jazz.FIRST+1) {
			JazzUI.drawText(Jazz.fingersText[Jazz.FIRST],JazzHands.getHandPosX(), JazzHands.getHandPosY());
		}
		else if (Jazz.frameDigitCount === Jazz.SECOND+1) {
			JazzUI.drawText(Jazz.fingersText[Jazz.SECOND],JazzHands.getHandPosX(), JazzHands.getHandPosY());
		}
		else if (Jazz.frameDigitCount === Jazz.THIRD+1) {
			JazzUI.drawText(Jazz.fingersText[Jazz.THIRD],JazzHands.getHandPosX(), JazzHands.getHandPosY());
		}
		else if (Jazz.frameDigitCount === Jazz.FOURTH+1) {
			JazzUI.drawText(Jazz.fingersText[Jazz.FOURTH],JazzHands.getHandPosX(), JazzHands.getHandPosY());
		}
	}

	/**
	 * 	drawTimerArc()
	 *
	 *	Render the timer arc to indicate an upcoming event
	 **/
	JazzUI.drawTimerArc = function(fingerPos, percentage) {
		if (percentage < 5) {
			return;
		}

		radius = (percentage*0.01*2)*Math.PI;

		JazzUI.getContext().beginPath();
		JazzUI.getContext().arc(JazzHands.getXForCoords(fingerPos), JazzHands.getYForCoords(fingerPos), 30, 0, radius);
		JazzUI.getContext().lineWidth=10;
		JazzUI.getContext().strokeStyle="green";
		JazzUI.getContext().stroke();

		JazzUI.getBlurredContext().beginPath();
		JazzUI.getBlurredContext().arc(JazzHands.getXForCoords(fingerPos), JazzHands.getYForCoords(fingerPos), 30, 0, radius);
		JazzUI.getBlurredContext().lineWidth=10;
		JazzUI.getBlurredContext().strokeStyle="green";
		JazzUI.getBlurredContext().stroke();

	}

	/**
	 *	getDetectedNav()
	 *
	 *  Determine hand position and capture timed navigation event
	 */
	JazzUI.getDetectedNav = function () {
		var detectedNav = false;

		if (JazzUI.canDrawHandLeft())
			detectedNav = "left";
		else if (JazzUI.canDrawHandRight())
			detectedNav = "right";
		else if (JazzUI.canDrawHandUp())
			detectedNav = "up";
		else if (JazzUI.canDrawHandDown())
			detectedNav = "down";
		else if (JazzUI.canDrawZoomIn())
			detectedNav = "zoomIn";
		else if (JazzUI.canDrawZoomOut())
			detectedNav = "zoomOut";

		return detectedNav;
	}

	/**
	 *	JazzUI.getContext()
	 **/
	JazzUI.getContext = function (isBlurred) {
		if (Jazz.ctx)  return Jazz.ctx;
		Jazz.ctx = Jazz.canvas.getContext("2d");
		return Jazz.ctx;
	}
	JazzUI.getBlurredContext = function () {
		if (Jazz.blurredCtx) return Jazz.blurredCtx;
		Jazz.blurredCtx = Jazz.blurredCanvas.getContext("2d");
		return Jazz.blurredCtx;
	}


})();