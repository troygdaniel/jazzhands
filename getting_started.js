$(function() {
	console.log("getting started")
	Jazz.init({
		fillStyle: "black",
		fingerWaitTimer: 1600
	}, function () {
	    document.querySelector(".hint").innerHTML = "<p>Tap on the left or right to navigate</p>";
	});

	Jazz.on("finger", function(fingers) {
		console.log("on fingers = " + fingers)
	});

	Jazz.on("navigation", function(nav) {
		var $active = $(".active");
		var activeId = $active.attr("id");

		console.log("navigation = "+ nav);
		

		// TODO: organize the map in a more manageable way

		// Navigation from Welcome slides
		if (activeId === "welcome-1")
			goRight(nav, "welcome-2");
			goDown(nav, "TOC");
		
		if (activeId === "welcome-2") {
			goRight(nav, "welcome-3");
			goLeft(nav,  "welcome-1");
			goDown(nav, "TOC");
		}
		if (activeId === "welcome-3") {
			goRight(nav,"TOC");
			goLeft(nav, "welcome-2");
			goDown(nav, "TOC");
		}
		if (activeId === "TOC") {
			goLeft(nav, "welcome-3");
			goIn(nav, "welcome-1");
			goUp(nav, "welcome-1");
			goDown(nav, "implement-1");
		}
		if (activeId === "implement-1") {
			goLeft(nav, "TOC");
			goUp(nav, "TOC");
			goRight(nav, "implement-2");
		}
		if (activeId === "implement-2") {
			goLeft(nav, "implement-1");
			goUp(nav, "TOC");
			goRight(nav, "implement-3");
		}
		if (activeId === "implement-3") {
			goLeft(nav, "implement-2");
			goRight(nav, "implement-4");
		}
		if (activeId === "implement-4") {
			goLeft(nav, "implement-3");
			goUp(nav, "TOC");
			goRight(nav, "TOC");
		}

		// Global zoom out to TOC
		goOut(nav,"TOC");
	});

	impress().init();
	function goLeft(nav, href) {
		if (nav === "left") {
			go(href);
		}
	}
	function goRight(nav, href) {
		if (nav === "right") {
			go(href)
		}
	}
	function goUp(nav, href) {
		if (nav === "up") {
			go(href);
		}
	}
	function goDown(nav, href) {
		if (nav === "down") {
			go(href);
		}
	}
	function goOut(nav, href) {
		if (nav === "zoomOut") {
			go(href);
		}
	}
	function goIn(nav, href) {
		if (nav === "zoomIn") {
			go(href)
		}
	}
	function go(href) {
		window.location.href="#"+href;
	}

});