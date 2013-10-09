function JazzEventHelper() {
    var hands = Jazz.hands;
    var config = Jazz.config;
    var movingQuicklyThreshold = 200;

    // Initate a timer and eventually trigger the "navigation" event.
    // Event callbacks are bound by Jazz.on("navigation") 
    this.handleNavigation = function() {

        if (hands.getCapturedDigits() < Jazz.LAST_VALID_FINGER)
            return false;

        if (hands.hasDetectedHand() === true) {
            if (hands.isNewHandMotion() === true) {
                this.clearTimeoutForNav();
                this.setTimeoutForNav();
            }

            if (Jazz.ui.getDetectedNav() === false) {
                this.clearTimeoutForNav();
                Jazz.handNavigation = null;
            }

            Jazz.handNavigation = Jazz.ui.getDetectedNav();
        }
    };
    this.isHandMovingQuickly = function() {
        return (this.isHandMovingOutQuickly() || this.isHandMovingInQuickly());
    };
    this.isHandMovingOutQuickly = function() {

        if (Jazz.handsArray.length > 0) {
            var x = Jazz.handsArray[0].palmVelocity[0];
            var y = Jazz.handsArray[0].palmVelocity[1];
            var z = Jazz.handsArray[0].palmVelocity[2];
            if (x < -1 * movingQuicklyThreshold || y < -1 * movingQuicklyThreshold || z < -1 * movingQuicklyThreshold) {
                return true;
            } else
                return false;
        } else
            return false;
    };
    this.isHandMovingInQuickly = function() {
        if (Jazz.handsArray.length > 0) {
            var x = Jazz.handsArray[0].palmVelocity[0];
            var y = Jazz.handsArray[0].palmVelocity[1];
            var z = Jazz.handsArray[0].palmVelocity[2];
            if (x > movingQuicklyThreshold || y > movingQuicklyThreshold || z > movingQuicklyThreshold) {
                return true;
            } else
                return false;
        } else
            return false;
    };
    this.handleGrabRelease = function() {

        if (this.isHandMovingOutQuickly() === false && Jazz.handsArray.length === 0) {
            if (Jazz.isGrabbing === true) {
                Jazz.isGrabbing = false;
                Jazz.event.release();
            }
            return;
        }
        // TODO: Surface this HACK (1 finger === grab)
        if (hands.getCapturedDigits() <= 1) {
            if (this.isHandMovingOutQuickly() === false && Jazz.isGrabbing === false) {
                Jazz.event.grab();
            }
            Jazz.isGrabbing = true;

        } else {

            if (this.isHandMovingOutQuickly() === false && Jazz.isGrabbing === true) {
                Jazz.isGrabbing = false;
                Jazz.event.release();
            }
        }
    };
    // TODO: Cleanup and shorten up this method
    this.handleProgressNav = function(detectedNav) {
        var yawLeft, yawRight, pitchUp, pitchDown, rollRight, rollLeft;
        if (Jazz.handsArray.length > 0) {
            var roll = parseInt(Jazz.handsArray[0].roll() * 100);
            var pitch = parseInt(Jazz.handsArray[0].pitch() * 100) - 40;
            var yaw = parseInt(Jazz.handsArray[0].yaw() * 100) + 10;
            yawLeft = yawRight = pitchUp = pitchDown = rollRight = rollLeft = 0;

            if (roll > 0) {
                rollLeft = roll;
                if (rollLeft > 100) rollLeft = 100;
            } else if (roll < 0) {
                rollRight = (-1 * roll);
                if (rollRight > 100) rollRight = 100;
            }
            if (pitch > 0) {
                pitchUp = pitch;
                if (pitchUp > 100) pitchUp = 100;
            } else if (pitch < 0) {
                pitchDown = (-1 * pitch);
                if (pitchDown > 100) pitchDown = 100;
            }
            if (yaw > 0) {
                yawRight = (yaw);
                if (yawRight > 100) yawRight = 100;
            } else if (yaw < 0) {
                yawLeft = -1 * yaw;
                if (yawLeft > 100) yawLeft = 100;
            }
        }

        if (this.isHandMovingQuickly() === true || Jazz.handsArray.length === 0) return;
        var verticalDistance = config.threshold("up") - config.threshold("down");
        var upProgress = (hands.palm("vertical") - config.threshold("down")) / verticalDistance;
        if (upProgress > 1) upProgress = 1;
        if (upProgress < 0) upProgress = 0;
        var downProgress = 1 - upProgress;

        var horizontalDistance = config.threshold("right") - config.threshold("left");
        var rightProgress = (hands.palm("horizontal") - config.threshold("left")) / horizontalDistance;
        if (rightProgress > 1) rightProgress = 1;
        if (rightProgress < 0) rightProgress = 0;
        var leftProgress = 1 - rightProgress;

        var depthDistance = config.threshold("zoomIn") - config.threshold("zoomOut");
        var zoomInProgress = (hands.palm("depth") - config.threshold("zoomOut")) / depthDistance;
        if (zoomInProgress > 1) zoomInProgress = 1;
        if (zoomInProgress < 0) zoomInProgress = 0;
        var zoomOutProgress = 1 - zoomInProgress;

        var navProgress = {
            "up": parseInt(upProgress * 100),
            "down": parseInt(downProgress * 100),
            "right": parseInt(rightProgress * 100),
            "left": parseInt(leftProgress * 100),
            "zoomIn": parseInt(zoomInProgress * 100),
            "zoomOut": parseInt(zoomOutProgress * 100),
            "pitchUp": pitchUp,
            "pitchDown": pitchDown,
            "rollRight": rollRight,
            "rollLeft": rollLeft,
            "yawRight": yawRight,
            "yawLeft": yawLeft
        };
        Jazz.event.progress(navProgress);

        return navProgress;
    };
    // Determine if a new finger count is found, 
    // and reset or start the timer for the fingers being held.
    this.handleFingers = function() {

        if (hands.isNewFingerCount())
            this.clearTimeoutForDigits();

        if (hands.isHoldingValidFinger())
            this.setTimeoutForDigits();

        Jazz.lastDigitsFound = hands.getCapturedDigits();
    };
    //  Allow binding to the Jazz.on("gesture") event
    //  to simplify the callback for LEAP generated gestures.
    this.handleGestureEvents = function() {
        var gestures = Jazz.lastFrame.gestures;
        if (hands.getCapturedDigits() > 0 && gestures.length > 0) {
            for (var indx = 0; indx < gestures.length; indx++) {
                Jazz.lastGesture = gestures[indx];
            }
        } else {
            if (Jazz.lastGesture) {
                var g = Jazz.lastGesture;
                var validGesture = true;

                if (g.type === "circle" && g.radius < 100)
                    validGesture = false;

                if (validGesture === true)
                    Jazz.event.gestures(Jazz.lastGesture);
                Jazz.lastGesture = null;
            }
        }
    };
    // Reset the timer, cancelling all upcoming "fingers" events
    this.clearTimeoutForDigits = function() {

        if (Jazz.frameDigitCount > 0) {
            clearTimeout(Jazz.intervalTimer);
            Jazz.lastDigitsFound = Jazz.incr = Jazz.timerPercentage = 0;
        }
    };
    // Set the timer for an upcoming "fingers" event
    this.setTimeoutForDigits = function() {
        this.clearTimeoutForDigits();

        Jazz.intervalTimer = setInterval(function() {

            Jazz.incr += Jazz.WAIT_INTERVAL_TIMER;

            if (Jazz.ui.getTimerPercentage() > 100) {
                clearTimeout(Jazz.intervalTimer);
                if (Jazz.handsArray.length > 0 && Jazz.lastDigitsFound < Jazz.LAST_VALID_FINGER) {
                    Jazz.event.fingers(hands.getCapturedDigits());
                }
            }

        }, Jazz.WAIT_INTERVAL_TIMER);
    };
    // Reset the timer, cancelling all upcoming "navigation" events
    this.clearTimeoutForNav = function() {
        clearTimeout(Jazz.intervalTimer);
        Jazz.handNavigation = Jazz.incr = Jazz.timerPercentage = 0;
    };
    // Set the timer for an upcoming "navigation" event
    this.setTimeoutForNav = function() {
        var that = this;
        this.clearTimeoutForNav();

        Jazz.intervalTimer = setInterval(function() {
            Jazz.incr += Jazz.WAIT_INTERVAL_TIMER;

            if (Jazz.ui.getTimerPercentage() > 100) {
                clearTimeout(Jazz.intervalTimer);
                if (Jazz.handsArray.length > 0) {
                    Jazz.event.navigation(Jazz.handNavigation);
                    Jazz.lastHand = Jazz.handNavigation;
                    Jazz.repeatNavInterval = setTimeout(function() {
                        if (Jazz.handNavigation === Jazz.lastHand) {
                            that.clearTimeoutForNav();
                            clearTimeout(Jazz.repeatNavInterval);
                        }
                    }, 900);
                }
            }
        }, Jazz.WAIT_INTERVAL_TIMER);
    };
}