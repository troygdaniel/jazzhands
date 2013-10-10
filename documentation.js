$(function() {

	impress().init();

    var navigationMap = {
        start: {
            down: "first-home",
            zoomIn: "first-home",
            zoomOut: "start"
        },
        "first-home": {
            left: "third-home",
            right: "second-home",
            down: "first-1",
            zoomIn: "first-1",
            zoomOut: "start",
            up: "start"
        },
        "first-1": {
            up: "first-home",
            left: "first-home",
            right: "first-2",
            zoomOut: "first-home"
        },
        "first-2": {
            up: "first-home",
            left: "first-1",
            down: "first-2",
            right: "first-3",
            zoomOut: "first-home"
        },
        "first-3": {
            up: "first-home",
            left: "first-2",
            zoomOut: "first-home",
            right: "first-home"
        },
        "second-home": {
            left: "first-home",
            down: "second-1",
            zoomIn: "second-1",
            right: "third-home",
            zoomOut: "start",
            up: "start"
        },
        "second-1": {
            up: "second-home",
            left: "second-home",
            right: "second-2",
            zoomOut: "second-home"
        },
        "second-2": {
            up: "second-home",
            left: "second-1",
            right: "second-3",
            zoomOut: "second-home"
        },
        "second-3": {
            up: "second-home",
            left: "second-2",
            right: "second-4",
            down: "second-3",
            zoomOut: "second-home",
            right: "second-home"
        },
        "third-home": {
            left: "second-home",
            down: "third-1",
            zoomIn: "third-1",
            zoomOut: "start",
            up: "start",
            right: "first-home"
        },
        "third-1": {
            up: "third-home",
            left: "third-home",
            right: "third-2",
            zoomOut: "third-home"
        },
        "third-2": {
            up: "third-home",
            left: "third-1",
            right: "third-3",
            down: "third-2",
            zoomOut: "third-home"
        },
        "third-3": {
            up: "third-home",
            left: "third-2",
            zoomOut: "third-home",
            up: "third-home",
            right: "third-home"
        }
    };

	Jazz.init({
		disableZoom: true,
		disableFingers: true,
		waitTimer: 450
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
        
        if (Jazz.isGrabbing === true) {
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
			if (typeof(navigationMap[activeId]["zoomOut"]) !== undefined)
				go(navigationMap[activeId]["zoomOut"]);
		}

		if (Jazz.disableFingers === false && f === 2 && navigationMap[activeId]) {
			go(navigationMap[activeId]["zoomIn"]);
			Jazz.disableFingers=true;
			Jazz.clearFingersText();
		}


	});

	$(document).keypress(function(e) { 
	    if (e.which == 49) { 
	    	window.location.href="#first-home";
	    }
	    if (e.which == 50) {
	    	window.location.href="#second-home";
	    }
	    if (e.which == 51) {
	    	window.location.href="#second-home";
	    }
	    if (e.which == 32 ) {
	    	var isMainTopic = ($(".active").attr("id").indexOf("home") >= 0 || $(".active").attr("id").indexOf("main") >= 0);
	    	var currentTopic = $(".active").attr("id").substring(0,$(".active").attr("id").indexOf("-"));
	    	
	    	if (isMainTopic === true)
	    		window.location.href="#start"; 
	    	else
	    		window.location.href="#"+currentTopic+"-home";
	 	}  // esc   (does not work)
	});

	function go(href) {
		if (href+"" != "undefined")
			window.location.href="#"+href;
	}

	function onTarget(href) {
		window.captureFrames = false;
		if (href === "third-2") {
			window.captureFrames = true;
		} else if (href === "second-3") {			
			Jazz.disableHelper=true;
		}
		else {
			Jazz.clearFingersText();
			Jazz.disableHelper = false;
		}
	}

});