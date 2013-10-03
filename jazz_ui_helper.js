(function(){

	var root = this;
	var JzUIHelp = root.JzUIHelp = {};

	 // Render a configured hoverText for a given finger
	JzUIHelp.drawFingerText = function () {
		if (Jazz.frameDigitCount === Jazz.FIRST+1) {
			JzUIHelp.drawText(Jazz.fingersText[Jazz.FIRST],JazzHands.getHandPosX(), JazzHands.getHandPosY());
		}
		else if (Jazz.frameDigitCount === Jazz.SECOND+1) {
			JzUIHelp.drawText(Jazz.fingersText[Jazz.SECOND],JazzHands.getHandPosX(), JazzHands.getHandPosY());
		}
		else if (Jazz.frameDigitCount === Jazz.THIRD+1) {
			JzUIHelp.drawText(Jazz.fingersText[Jazz.THIRD],JazzHands.getHandPosX(), JazzHands.getHandPosY());
		}
		else if (Jazz.frameDigitCount === Jazz.FOURTH+1) {
			JzUIHelp.drawText(Jazz.fingersText[Jazz.FOURTH],JazzHands.getHandPosX(), JazzHands.getHandPosY());
		}
	}

	JzUIHelp.drawTimerArc = function(fingerPos, percentage) {
		if (percentage < 5) return;

		radius = (percentage*0.01*2)*Math.PI;

		JzUIHelp.evalCtx(function(ctx) {
			ctx.beginPath();
			ctx.arc(JazzHands.getXForCoords(fingerPos), JazzHands.getYForCoords(fingerPos), 30, 0, radius);
			ctx.lineWidth=10;
			ctx.strokeStyle="green";
			ctx.stroke();
		});
	}
	JzUIHelp.getContext = function (isBlurred) {
		if (Jazz.ctx)  return Jazz.ctx;
		Jazz.ctx = Jazz.canvas.getContext("2d");
		return Jazz.ctx;
	}
	JzUIHelp.getBlurredContext = function () {
		if (Jazz.blurredCtx) return Jazz.blurredCtx;
		Jazz.blurredCtx = Jazz.blurredCanvas.getContext("2d");
		return Jazz.blurredCtx;
	}
	JzUIHelp.getContexts = function () {
		return [JzUIHelp.getContext(), JzUIHelp.getBlurredContext()];	
	}
	// Execute block on both blurred and normal canvas
	JzUIHelp.evalCtx = function(callback) {
		$.each(JzUIHelp.getContexts(), function(i, ctx) {
		    callback(ctx);
		});
	}

	JzUIHelp.createBaseCanvas = function (isBlurred, divId) {
		var canvas = document.createElement("canvas");
		var calculatedWidth = document.body.clientWidth*.9;
		var cssStyle = "position:absolute;top:105px;left:-25px;"
		if (calculatedWidth < 1000) calculatedWidth = 1050;
		if (isBlurred) cssStyle+=JzUIHelp.blurStyle();

		canvas.setAttribute("id", divId);
		canvas.setAttribute("style",cssStyle);

		canvas.setAttribute("width", calculatedWidth+"px");
		canvas.setAttribute("height", "410px");

		return canvas;
	}

	JzUIHelp.drawCircle = function(coords) {

		if (Jazz.timerPercentage === 0){
			JzUIHelp.evalCtx(function(ctx) {
				ctx.beginPath();
				ctx.arc(JazzHands.getXForCoords(coords), JazzHands.getYForCoords(coords), JazzHands.getRadiusForFinger(coords), 0, 2*Math.PI);
				ctx.fill();
			});	
		}
	}
	JzUIHelp.blurStyle = function () {
		return "-webkit-filter: blur(10px);-moz-filter: blur(10px);-o-filter: blur(10px);-ms-filter: blur(10px)filter: blur(10px);";
	}
	//	Render text at a given x,y coordinate
	JzUIHelp.drawText = function (txt, x, y) {
		if (txt) {

			JzUIHelp.evalCtx(function(ctx) {
				ctx.clearRect(0,0,Jazz.canvas.width, Jazz.canvas.height);
				ctx.font='bold 22pt Arial';			    
			    ctx.fillStyle = Jazz.fillStyle;
				ctx.strokeStyle = 'white';
				ctx.fillText(txt, x, y-30);
			});
		}
	}
	JzUIHelp.drawHelperArrows = function () {
		JzUIHelp.evalCtx(function(ctx) {
			ctx.drawImage(Jazz.upHelperArrow, JazzHands.getHandPosX()-17, -390);
			ctx.drawImage(Jazz.rightHelperArrow, -820, JazzHands.getHandPosY()-15);
			ctx.drawImage(Jazz.leftHelperArrow, -1030, JazzHands.getHandPosY()-15);
			ctx.drawImage(Jazz.downHelperArrow, JazzHands.getHandPosX()-17, -215);
		});	
	}
	JzUIHelp.drawUpArrow = function () {
		JzUIHelp.evalCtx(function(ctx) {
			ctx.drawImage(Jazz.upArrow, JazzHands.getHandPosX()-17, JazzHands.getHandPosY()-15);
		});
	}
	JzUIHelp.drawDownArrow = function () {
		JzUIHelp.evalCtx(function(ctx) {
			ctx.drawImage(Jazz.downArrow, JazzHands.getHandPosX()-17, JazzHands.getHandPosY()-15);
		});
	}
	JzUIHelp.drawLeftArrow = function () { 
		JzUIHelp.evalCtx(function(ctx) {
			ctx.drawImage(Jazz.leftArrow, JazzHands.getHandPosX()-17, JazzHands.getHandPosY()-15);
		});
	}
	JzUIHelp.drawRightArrow = function () {
		JzUIHelp.evalCtx(function(ctx) {
			ctx.drawImage(Jazz.rightArrow, JazzHands.getHandPosX()-14, JazzHands.getHandPosY()-15);
		});
	}
	JzUIHelp.drawZoomInIcon = function () {
		JzUIHelp.evalCtx(function(ctx) {
			ctx.drawImage(Jazz.zoomIn, JazzHands.getHandPosX()-24, JazzHands.getHandPosY()-20);
		});
	}
	JzUIHelp.drawZoomOutIcon = function () {
		JzUIHelp.evalCtx(function(ctx) {
			ctx.drawImage(Jazz.zoomOut, JazzHands.getHandPosX()-19, JazzHands.getHandPosY()-20);
		});
	}
	JzUIHelp.canDrawHandUp = function () {
		if (JazzHands.palm("vertical") > JazzConfig.threshold("up")) {
			JzUIHelp.drawUpArrow();
			return true;
		} else
			return false;
	}
	JzUIHelp.canDrawHandDown = function () {
		if (JazzHands.palm("vertical") < JazzConfig.threshold("down")) {
			JzUIHelp.drawDownArrow();
			return true;
		} else
			return false;
	}
	JzUIHelp.canDrawHandLeft = function () {
		if (JazzHands.palm("horizontal") < JazzConfig.threshold("left")) {
			JzUIHelp.drawLeftArrow();
			return true;
		} else
			return false;
	}
	JzUIHelp.canDrawHandRight = function() {
		if (JazzHands.palm("horizontal") > JazzConfig.threshold("right")) {
			JzUIHelp.drawRightArrow();
			return true;
		} else
			return false;
	}
	JzUIHelp.canDrawZoomIn = function() {
		if (JazzHands.palm("depth") < JazzConfig.threshold("zoomIn")) {
			if (Jazz.disableZoom === false) {
				JzUIHelp.drawZoomInIcon();
				return true;
			}
		}
		return false;
	}
	JzUIHelp.canDrawZoomOut = function() {
		if (JazzHands.palm("depth") > JazzConfig.threshold("zoomOut")) {
			if (Jazz.disableZoom === false) {
				JzUIHelp.drawZoomOutIcon();
				return true;
			}
		}
		return false;
	}
})();