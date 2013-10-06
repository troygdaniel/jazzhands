function JazzUIHelper() {
	var hands = Jazz.hands;

	 // Render a configured hoverText for a given finger
	this.drawFingerText = function () {
		if (Jazz.frameDigitCount === Jazz.FIRST+1) {
			this.drawText(Jazz.fingersText[Jazz.FIRST],hands.getHandPosX(), hands.getHandPosY());
		}
		else if (Jazz.frameDigitCount === Jazz.SECOND+1) {
			this.drawText(Jazz.fingersText[Jazz.SECOND],hands.getHandPosX(), hands.getHandPosY());
		}
		else if (Jazz.frameDigitCount === Jazz.THIRD+1) {
			this.drawText(Jazz.fingersText[Jazz.THIRD],hands.getHandPosX(), hands.getHandPosY());
		}
		else if (Jazz.frameDigitCount === Jazz.FOURTH+1) {
			this.drawText(Jazz.fingersText[Jazz.FOURTH],hands.getHandPosX(), hands.getHandPosY());
		}
	}
	this.drawTimerArc = function(fingerPos, percentage) {
		if (percentage < 5) return;

		radius = (percentage*0.01*2)*Math.PI;

		this.evalCtx(function(ctx) {
			ctx.beginPath();
			ctx.arc(hands.getXForCoords(fingerPos), hands.getYForCoords(fingerPos), 30, 0, radius);
			ctx.lineWidth=10;
			ctx.strokeStyle="green";
			ctx.stroke();
		});
	}
	this.getContext = function (isBlurred) {
		if (Jazz.ctx)  return Jazz.ctx;
		Jazz.ctx = Jazz.canvas.getContext("2d");
		return Jazz.ctx;
	}
	this.getBlurredContext = function () {
		if (Jazz.blurredCtx) return Jazz.blurredCtx;
		Jazz.blurredCtx = Jazz.blurredCanvas.getContext("2d");
		return Jazz.blurredCtx;
	}
	this.getContexts = function () {
		return [this.getContext(), this.getBlurredContext()];	
	}
	// Execute block on both blurred and normal canvas
	this.evalCtx = function(callback) {
		Jazz.$.each(this.getContexts(), function(i, ctx) {
		    callback(ctx);
		});
	}
	this.createBaseCanvas = function (isBlurred, divId) {
		var canvas = document.createElement("canvas");
		var calculatedWidth = document.body.clientWidth*.9;
		var cssStyle = "position:absolute;top:105px;left:-25px;"
		if (calculatedWidth < 1000) calculatedWidth = 1050;
		if (isBlurred) cssStyle+=this.blurStyle();

		canvas.setAttribute("id", divId);
		canvas.setAttribute("style",cssStyle);

		canvas.setAttribute("width", calculatedWidth+"px");
		canvas.setAttribute("height", "410px");

		return canvas;
	}
	this.drawCircle = function(coords) {

		if (Jazz.timerPercentage === 0){
			this.evalCtx(function(ctx) {
				ctx.beginPath();
				ctx.arc(hands.getXForCoords(coords), hands.getYForCoords(coords), hands.getRadiusForFinger(coords), 0, 2*Math.PI);
				ctx.fill();
			});	
		}
	}
	this.blurStyle = function () {
		return "-webkit-filter: blur(10px);-moz-filter: blur(10px);-o-filter: blur(10px);-ms-filter: blur(10px)filter: blur(10px);";
	}
	//	Render text at a given x,y coordinate
	this.drawText = function (txt, x, y) {
		if (txt) {

			this.evalCtx(function(ctx) {
				ctx.clearRect(0,0,Jazz.canvas.width, Jazz.canvas.height);
				ctx.font='bold 22pt Arial';			    
			    ctx.fillStyle = Jazz.fillStyle;
				ctx.strokeStyle = 'white';
				ctx.fillText(txt, x, y-30);
			});
		}
	}
	this.drawHelperArrows = function () {
		this.evalCtx(function(ctx) {
			ctx.drawImage(Jazz.upHelperArrow, hands.getHandPosX()-17, -390);
			ctx.drawImage(Jazz.rightHelperArrow, -820, hands.getHandPosY()-15);
			ctx.drawImage(Jazz.leftHelperArrow, -1030, hands.getHandPosY()-15);
			ctx.drawImage(Jazz.downHelperArrow, hands.getHandPosX()-17, -215);
		});	
	}
	this.drawUpArrow = function () {
		this.evalCtx(function(ctx) {
			ctx.drawImage(Jazz.upArrow, hands.getHandPosX()-17, hands.getHandPosY()-15);
		});
	}
	this.drawDownArrow = function () {
		this.evalCtx(function(ctx) {
			ctx.drawImage(Jazz.downArrow, hands.getHandPosX()-17, hands.getHandPosY()-15);
		});
	}
	this.drawLeftArrow = function () { 
		this.evalCtx(function(ctx) {
			ctx.drawImage(Jazz.leftArrow, hands.getHandPosX()-17, hands.getHandPosY()-15);
		});
	}
	this.drawRightArrow = function () {
		this.evalCtx(function(ctx) {
			ctx.drawImage(Jazz.rightArrow, hands.getHandPosX()-14, hands.getHandPosY()-15);
		});
	}
	this.drawZoomInIcon = function () {
		this.evalCtx(function(ctx) {
			ctx.drawImage(Jazz.zoomIn, hands.getHandPosX()-24, hands.getHandPosY()-20);
		});
	}
	this.drawZoomOutIcon = function () {
		this.evalCtx(function(ctx) {
			ctx.drawImage(Jazz.zoomOut, hands.getHandPosX()-19, hands.getHandPosY()-20);
		});
	}
	this.canDrawHandUp = function () {
		if (hands.palm("vertical") > Jazz.config.threshold("up")) {
			this.drawUpArrow();
			return true;
		} else
			return false;
	}
	this.canDrawHandDown = function () {
		if (hands.palm("vertical") < Jazz.config.threshold("down")) {
			this.drawDownArrow();
			return true;
		} else
			return false;
	}
	this.canDrawHandLeft = function () {
		if (hands.palm("horizontal") < Jazz.config.threshold("left")) {
			this.drawLeftArrow();
			return true;
		} else
			return false;
	}
	this.canDrawHandRight = function() {
		if (hands.palm("horizontal") > Jazz.config.threshold("right")) {
			this.drawRightArrow();
			return true;
		} else
			return false;
	}
	this.canDrawZoomIn = function() {
		if (hands.palm("depth") < Jazz.config.threshold("zoomIn")) {
			if (Jazz.disableZoom === false) {
				this.drawZoomInIcon();
				return true;
			}
		}
		return false;
	}
	this.canDrawZoomOut = function() {
		if (hands.palm("depth") > Jazz.config.threshold("zoomOut")) {
			if (Jazz.disableZoom === false) {
				this.drawZoomOutIcon();
				return true;
			}
		}
		return false;
	}
}