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
			down: "full-1"
		},
		"full-1": {
			up: "full-home",
			right: "full-3",
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
		"full-4": {
			up: "full-home",
			left: "full-3",
			right: "full-5",			
			zoomOut: "full-home"
		},
		"full-5": {
			up: "full-home",
			left: "full-4",
			right: "full-5",			
			zoomOut: "full-home"
		},
		"full-6": {
			up: "full-home",
			left: "full-5",
			zoomOut: "full-home"
		}
	};

	Jazz.init({
		disableZoom: false,
		disableFingers: true,
		// fingersHoverText: ["Zoom out?!","Zoom In!"],
		waitTimer: 700
	});

	Jazz.on("gestures", function (g) {
		$("#detected-gesture").html(g);
	});

	Jazz.on("grab", function () {
		$("#grab-release-detection").html("Grabbing");
	});
	Jazz.on("release", function () {
		$("#grab-release-detection").html("Release");
	});
    Jazz.on("progress", function (progress) {
        $("#progress-detection").html("up = "+progress["up"]+    "%, down = "+progress["down"]+"%, right = "+progress["right"]+"%, left = "+progress["left"]+"%"+"<BR>isGrabbing="+Jazz.isGrabbing);
    });            
    Jazz.on("frames", function (f) {
		if (window.detectFrame === true)
			$("#frame-detection").html(f);
    });
	Jazz.on("navigation", function(nav) {
		var activeId = $(".active").attr("id");
		console.log(activeId+","+nav);
		if (navigationMap[activeId]) {
			go(navigationMap[activeId][nav])
			onTarget(activeId);
		}
	});

	Jazz.on("fingers", function(f) {
		var activeId = $(".active").attr("id");

		if (Jazz.disableFingers === false && f === 1 && navigationMap[activeId]) {
			go(navigationMap[activeId]["zoomOut"]);
		}

		if (Jazz.disableFingers === false && f === 2 && navigationMap[activeId]) {
			go(navigationMap[activeId]["zoomIn"]);
			Jazz.disableFingers=true;
			Jazz.LAST_VALID_FINGER = 1;
		}


	});

	impress().init();

	function go(href) {
		window.location.href="#"+href;
	}

	function onTarget(href) {
		console.log("target = " + href);
		window.detectFrame = false;
		if (href === "full-1") {
			Jazz.fingersHoverText = ["Zoom Out?", "Zoom in?"];
			Jazz.LAST_VALID_FINGER = 3;
		}
		if (href === "full-6") {
			window.detectFrame = true;
		}
	}

});