(function(){

	var root = this;
	var JazzHands = root.JazzHands = {};

	JazzHands.getFingersMap = function (key) {
		if (Jazz.lastFrame.pointablesMap) {
			if (key)
				return Jazz.lastFrame.pointablesMap[key];
			else
				return Jazz.lastFrame.pointablesMap;
		}
		return undefined;
	}
	JazzHands.getFinger = function (key) {
		return JazzHands.getFingersMap(key);
	}
	JazzHands.getRadiusForFinger = function (coords) {
		return Math.min(600/Math.abs(coords[2]),20) * Jazz.CIRCLE_RADIUS;
	}
	JazzHands.getYForCoords = function (coords) {
		return (-coords[1]-120)-JazzHands.getRadiusForFinger(coords)/2;
	}
	JazzHands.getXForCoords = function (coords) {
		return parseInt((coords[0]-900)-JazzHands.getRadiusForFinger(coords)/2);
	}

	JazzHands.getCapturedDigits = function() {
		return Jazz.frameDigitCount;
	}
	JazzHands.isNewFingerCount = function () {
		return ((JazzHands.getCapturedDigits() === 0) || Jazz.lastDigitsFound !== JazzHands.getCapturedDigits())
	}
	JazzHands.isHoldingFinger = function() {
		return (JazzHands.getCapturedDigits() > 0 && JazzHands.isNewFingerCount() == true);
	}
	JazzHands.isValidFinger = function () {
		return (JazzHands.getCapturedDigits() > 0 && JazzHands.getCapturedDigits() <= Jazz.LAST_VALID_FINGER);
	}
	JazzHands.isHoldingValidFinger = function () {
		return (JazzHands.isHoldingFinger() && JazzHands.isValidFinger()) === true;
	}
	JazzHands.hasDetectedHand = function() {
		return Jazz.hands.length > 0;
	}
	JazzHands.isNewHandMotion = function () {
		return (Jazz.handNavigation !== JazzUI.getDetectedNav());
	}
	JazzHands.getFirstFingerPos = function() {
		for (var i in JazzHands.getFingersMap()) {
			return JazzHands.getFingersMap(i).tipPosition;
		}
	}
	JazzHands.getHandPos = function(indx) {
		if ( Jazz.hands.length <= 0)
			return;

		if (indx === 0)
			return JazzHands.getXForCoords(Jazz.hands[0].palmPosition);
		else
			return JazzHands.getYForCoords(Jazz.hands[0].palmPosition);
	}
	JazzHands.getHandPosX = function() {
		return JazzHands.getHandPos(0);
	}
	JazzHands.getHandPosY = function() {
		return JazzHands.getHandPos(1);
	}
	JazzHands.palm = function(palmPosition) {
		if (Jazz.hands.length === 0) return;
		var hand = Jazz.hands[0];
		if (palmPosition === "horizontal")
			return hand.palmPosition[0];
		else if (palmPosition === "vertical")
			return hand.palmPosition[1];
		else if (palmPosition === "depth")
		 	return hand.palmPosition[2];
	}
	JazzHands.isNewHand = function() {
		return Jazz.lastHandId == Jazz.hands[0].id;
	}
}).call(this);