(function(){

	var root = this;
	var JazzUI = root.JazzUI = {};

	 // Create the canvas for rendering fingers and timers
	JazzUI.createFingerCanvas  = function () {
		var canvas = Jazz.canvas;

		JzUIHelp.evalCtx(function(ctx) {
		    ctx.translate(canvas.width*1.2,canvas.height);
			ctx.globalAlpha = Jazz.opacity;
		});
	}

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

	 // Update the canvas with the fingers and timer circles
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

			JzUIHelp.drawCircle(circleCoords);

			if (Jazz.disableHelper === false) {
				JzUIHelp.drawHelperArrows();
			}

			if (Jazz.disableTimer === false)
				JzUIHelp.drawTimerArc(circleCoords, Jazz.timerPercentage);

			if (canDrawFingerText && Jazz.disableFingers === false) 
				JzUIHelp.drawFingerText();

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
	
	JazzUI.clearCanvas = function() {
		var canvas = Jazz.canvas;
		JzUIHelp.evalCtx(function(ctx) {
			ctx.clearRect(-canvas.width*1.2,-canvas.height,canvas.width*1.2,canvas.height);
		});	
	}

	JazzUI.appendCanvasToDOM = function (){
		var canvas = JzUIHelp.createBaseCanvas(false,"jazz-fingers");
		var blurredCanvas = JzUIHelp.createBaseCanvas(true,"jazz-fingers-shadow");
		Jazz.blurredCanvas = blurredCanvas;
		document.body.appendChild(blurredCanvas);
		document.body.appendChild(canvas);

		return canvas;
	}

	JazzUI.getTimerPercentage = function() {
		Jazz.timerPercentage = parseInt ((Jazz.incr / Jazz.WAIT_FINGER_MS) * 100);
		return Jazz.timerPercentage;
	}

	
	//  Determine hand position and capture timed navigation event
	JazzUI.getDetectedNav = function () {
		var detectedNav = false;

		if (JzUIHelp.canDrawHandLeft())
			detectedNav = "left";
		else if (JzUIHelp.canDrawHandRight())
			detectedNav = "right";
		else if (JzUIHelp.canDrawHandUp())
			detectedNav = "up";
		else if (JzUIHelp.canDrawHandDown())
			detectedNav = "down";
		else if (JzUIHelp.canDrawZoomIn())
			detectedNav = "zoomIn";
		else if (JzUIHelp.canDrawZoomOut())
			detectedNav = "zoomOut";

		return detectedNav;
	}

}).call(this);