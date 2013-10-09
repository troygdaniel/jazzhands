function JazzUI() {

    var helper = new JazzUIHelper();
    var hands = Jazz.hands;

    // Create the canvas for rendering fingers and timers
    this.createFingerCanvas = function() {
        Jazz.canvas = this.appendCanvasToDOM();

        helper.evalCtx(function(ctx) {
            ctx.translate(Jazz.canvas.width * 1.2, Jazz.canvas.height);
            ctx.globalAlpha = Jazz.opacity;
        });
    };
    this.show = function() {
        Jazz.showUI = true;
    };
    this.hide = function() {
        Jazz.showUI = false;
    };
    this.clearFingersText = function() {
        Jazz.fingersText = [];
        Jazz.disableFingers = false;
        Jazz.LAST_VALID_FINGER = 1;
    };
    this.showCanvas = function() {
        if (Jazz.showUI === true) {
            document.getElementById("jazz-fingers").style.display = 'block';
            document.getElementById("jazz-fingers-shadow").style.display = 'block';
        }
    };
    this.hideCanvas = function() {
        document.getElementById("jazz-fingers").style.display = 'none';
        document.getElementById("jazz-fingers-shadow").style.display = 'none';
    };
    // Update the canvas with the fingers and timer circles
    this.updateCanvas = function() {

        this.clearCanvas();
        var fIndex = 0;
        // Build a grid for the jazz-hands canvas
        // render circles based on pointable positions
        for (var i in hands.getFingersMap()) {

            var isLastFinger = (++fIndex === Jazz.lastFrame.fingers.length);
            var canDrawFingerText = (Jazz.timerPercentage > 10 && isLastFinger);
            var circleCoords = hands.getFinger(i).tipPosition;

            if (Jazz.simpleMode === true && Jazz.handsArray.length > 0) {
                circleCoords = Jazz.handsArray[0].palmPosition;
            }

            helper.drawCircle(circleCoords);

            if (Jazz.disableHelper === false) {
                helper.drawHelperArrows();
            }

            if (Jazz.disableTimer === false)
                helper.drawTimerArc(circleCoords, Jazz.timerPercentage);

            if (canDrawFingerText && Jazz.disableFingers === false)
                helper.drawFingerText();

            if (Jazz.simpleMode === true)
                return;
        }

    };
    this.setFingersText = function(hoverText) {
        if (hoverText) {
            Jazz.fingersText = hoverText;
            Jazz.disableFingers = false;
            Jazz.LAST_VALID_FINGER = hoverText.length + 1;
        } else {
            Jazz.clearFingersText();
        }
    };
    this.clearCanvas = function() {
        var canvas = Jazz.canvas;
        helper.evalCtx(function(ctx) {
            ctx.clearRect(-canvas.width * 1.2, -canvas.height, canvas.width * 1.2, canvas.height);
        });
    };
    this.appendCanvasToDOM = function() {
        var canvas = helper.createBaseCanvas(false, "jazz-fingers");
        var blurredCanvas = helper.createBaseCanvas(true, "jazz-fingers-shadow");
        Jazz.blurredCanvas = blurredCanvas;
        document.body.appendChild(blurredCanvas);
        document.body.appendChild(canvas);

        return canvas;
    };
    this.getTimerPercentage = function() {
        Jazz.timerPercentage = parseInt((Jazz.incr / Jazz.WAIT_FINGER_MS) * 100);
        return Jazz.timerPercentage;
    };
    //  Determine hand position and capture timed navigation event
    this.getDetectedNav = function() {
        var detectedNav = false;

        if (helper.canDrawHandLeft())
            detectedNav = "left";
        else if (helper.canDrawHandRight())
            detectedNav = "right";
        else if (helper.canDrawHandUp())
            detectedNav = "up";
        else if (helper.canDrawHandDown())
            detectedNav = "down";
        else if (helper.canDrawZoomIn())
            detectedNav = "zoomIn";
        else if (helper.canDrawZoomOut())
            detectedNav = "zoomOut";

        return detectedNav;
    };
}