$(function() {

	var navigationMap = {
		main: {
			right: "basic-home",
			down: "main-home"
		},
		"basic-home": {
			left: "main",
			right: "full-home",
			down: "basic-1",
			zoomIn: "basic-1",
		},
		"basic-1": {
			up: "basic-home",
			right: "basic-2",
			zoomOut: "basic-home"
		},
		"basic-2": {
			up: "basic-home",
			left: "basic-1",
			right: "basic-3",
			zoomOut: "basic-home"
		},
		"basic-3": {
			up: "basic-home",
			left: "basic-2",
			zoomOut: "basic-home"
		},
		"full-home": {
			left: "basic-home",
			down: "full-1",
			zoomIn: "full-1",
			right: "under-home"
		},
		"full-1": {
			up: "full-home",
			left: "full-1",
			right: "full-2",
			zoomOut: "full-home"
		},
		"full-2": {
			up: "full-home",
			left: "full-1",
			right: "full-3",			
			zoomOut: "full-home"
		},
		"full-3": {
			up: "full-home",
			left: "full-2",
			right: "full-4",			
			zoomOut: "full-home"
		},
		"under-home": {
			left: "full-home",
			right: "main",
			down: "under-1",
			zoomIn: "under-1",
		},
		"under-1": {
			up: "under-home",
			left: "under-1",
			right: "under-2",
			zoomOut: "under-home"
		},
		"under-2": {
			up: "under-home",
			left: "under-1",
			right: "under-3",
			down: "under-2",			
			zoomOut: "under-home"
		},
		"under-3": {
			up: "under-home",
			left: "under-2",
			zoomOut: "under-home"
		}
	};

	Jazz.init({
		disableZoom: false,
		disableFingers: true,
		// fingersHoverText: ["Zoom out?!","Zoom In!"],
		waitTimer: 900
	});

	Jazz.on("gestures", function (g) {

		if (g.type === "swipe") 
			return;

		$("#gesture-debug").html("<B>&gt;</B> "+g.type);
		var $img = $("#gesture-image");
		if (g.type === "swipe") 
			$img.attr("src","tutorial_images/swipe_gesture.png");
		if (g.type === "keyTap") 
			$img.attr("src","tutorial_images/tap_gesture.png");
		if (g.type === "circle") 
			$img.attr("src","tutorial_images/circle_gesture.png");
		if (g.type === "screenTap") 
			$img.attr("src","tutorial_images/screen_tap_gesture.png");

	});

	Jazz.on("grab", function () {
		$("#grab-release-debug").html("<B>&gt;</B> Grabbing");
		$("#grab-release-image").attr("src","tutorial_images/closed_hand.png");
	});
	Jazz.on("release", function () {
		$("#grab-release-debug").html("<B>&gt;</B> Release");
		$("#grab-release-image").attr("src","tutorial_images/open_hand.png");
	});
    Jazz.on("progress", function (progress) {
        $("#progress-debug").html("<B>&gt;</B> up = "+progress["up"]+    "%, down = "+progress["down"]+"%, right = "+progress["right"]+"%, left = "+progress["left"]+"%");
        $(".axis-hand").hide();
        if (progress["up"]>70)
        	$("#y-axis-hand").show();
        else if (progress["right"]>70)
        	$("#x-axis-hand").show();
        else if (progress["zoomOut"]>70)
        	$("#z-axis-hand").show();
        
        if (Jazz.isGrabbing === true && Jazz.frameDigitCount <= 1) {
	        var $plane = $("#paper-plane");
	        var leftpx = 60 + (progress["right"] *4);
	        var toppx = -20 + (progress["down"] * 4);
	        var widthpx = 220 + (progress["zoomOut"] * 3);
	        $plane.css("left",leftpx+"px");
	        $plane.css("top",toppx+"px");
	        $plane.width(widthpx);
        }

    });            
    Jazz.on("frames", function (f) {
		if (window.captureFrames === true) {
			$("#frame-debug").html("<B>&gt;</B> frame rate="+parseInt(f.currentFrameRate)+", hands=" +f.hands.length+", fingers="+f.fingers.length);
			$("#finger-count-image").attr("src","tutorial_images/"+f.fingers.length+"_finger.png");
		}
    });
	Jazz.on("navigation", function(nav) {
		var activeId = $(".active").attr("id");
		$("#navigation-debug").html("<B>&gt;</B> "+nav);
		if (navigationMap[activeId]) {
			go(navigationMap[activeId][nav])
			onTarget(navigationMap[activeId][nav]);
		}
	});

	Jazz.on("fingers", function(f) {
		var activeId = $(".active").attr("id");
		$("#finger-debug").html("<B>&gt;</B> "+f);
		if (Jazz.disableFingers === false && f === 1 && navigationMap[activeId]) {
			go(navigationMap[activeId]["zoomOut"]);
		}

		if (Jazz.disableFingers === false && f === 2 && navigationMap[activeId]) {
			go(navigationMap[activeId]["zoomIn"]);
			Jazz.disableFingers=true;
			Jazz.clearFingersText();
		}


	});

	impress().init();

	function go(href) {
		window.location.href="#"+href;
	}

	function onTarget(href) {
		window.captureFrames = false;
		if (href === "full-1") {			
			Jazz.setFingersText(["Zoom Out?", "Zoom in?"]);
			Jazz.disableHelper = true;
			Jazz.WAIT_FINGER_MS=1200;
		} else if (href === "under-1") {
			Jazz.disableHelper = true;
		} else if (href === "under-2") {
			window.captureFrames = true;
		}
		else {
			Jazz.clearFingersText();
			Jazz.disableHelper = false;
			Jazz.WAIT_FINGER_MS=900;

		}
	}

});