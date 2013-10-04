function JazzHands(){
	var ui = Jazz.jzUI;

	this.getFingersMap = function (key) {
		if (Jazz.lastFrame.pointablesMap) {
			if (key)
				return Jazz.lastFrame.pointablesMap[key];
			else
				return Jazz.lastFrame.pointablesMap;
		}
		return undefined;
	}
	this.getFinger = function (key) {
		return this.getFingersMap(key);
	}
	this.getRadiusForFinger = function (coords) {
		return Math.min(600/Math.abs(coords[2]),20) * Jazz.CIRCLE_RADIUS;
	}
	this.getYForCoords = function (coords) {
		return (-coords[1]-120)-this.getRadiusForFinger(coords)/2;
	}
	this.getXForCoords = function (coords) {
		return parseInt((coords[0]-900)-this.getRadiusForFinger(coords)/2);
	}

	this.getCapturedDigits = function() {
		return Jazz.frameDigitCount;
	}
	this.isNewFingerCount = function () {
		return ((this.getCapturedDigits() === 0) || Jazz.lastDigitsFound !== this.getCapturedDigits())
	}
	this.isHoldingFinger = function() {
		return (this.getCapturedDigits() > 0 && this.isNewFingerCount() == true);
	}
	this.isValidFinger = function () {
		return (this.getCapturedDigits() > 0 && this.getCapturedDigits() <= Jazz.LAST_VALID_FINGER);
	}
	this.isHoldingValidFinger = function () {
		return (this.isHoldingFinger() && this.isValidFinger()) === true;
	}
	this.hasDetectedHand = function() {
		return Jazz.hands.length > 0;
	}
	this.isNewHandMotion = function () {
		return (Jazz.handNavigation !== Jazz.jzUI.getDetectedNav());
	}
	this.getFirstFingerPos = function() {
		for (var i in this.getFingersMap()) {
			return this.getFingersMap(i).tipPosition;
		}
	}
	this.getHandPos = function(indx) {
		if ( Jazz.hands.length <= 0)
			return;

		if (indx === 0)
			return this.getXForCoords(Jazz.hands[0].palmPosition);
		else
			return this.getYForCoords(Jazz.hands[0].palmPosition);
	}
	this.getHandPosX = function() {
		return this.getHandPos(0);
	}
	this.getHandPosY = function() {
		return this.getHandPos(1);
	}
	this.palm = function(palmPosition) {
		if (Jazz.hands.length === 0) return;
		var hand = Jazz.hands[0];
		if (palmPosition === "horizontal")
			return hand.palmPosition[0];
		else if (palmPosition === "vertical")
			return hand.palmPosition[1];
		else if (palmPosition === "depth")
		 	return hand.palmPosition[2];
	}
	this.isNewHand = function() {
		return Jazz.lastHandId == Jazz.hands[0].id;
	}
}