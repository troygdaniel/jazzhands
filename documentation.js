$(function() {

	var navigationMap = {
		main: {
			down: "user-home"
		},
		"user-home": {
			up: "main",
			down: "api-home",
			zoomIn: "user-1"
		},
		"user-1": {
			zoomOut: "user-home",
			right: "user-2"
		},
		"user-2": {
			zoomOut: "user-home",
			left: "user-1",
			right: "user-3"
		},
		"user-3": {
			zoomOut: "user-home",
			left: "user-2",
			right: "user-4"
		},
		"user-4": {
			zoomOut: "user-home",
			left: "user-3"
		},
		"api-home": {
			up: "user-home",
			down: "arch-home",
			zoomIn: "api-1"
		},
		"api-1": {
			zoomOut: "api-home",
			right: "api-2"
		},
		"api-2": {
			zoomOut: "api-home",
			left: "api-1",
			right: "api-3"
		},
		"api-3": {
			zoomOut: "api-home",
			left: "api-2",
			right: "api-4"
		},
		"api-4": {
			zoomOut: "api-home",
			left: "api-3"
		},
		"arch-home": {
			up: "api-home",
			down: "future-home",
			zoomIn: "arch-1"
		},
		"arch-1": {
			zoomOut: "arch-home",
			right: "arch-2"
		},
		"arch-2": {
			zoomOut: "arch-home",
			left: "arch-1",
			right: "arch-3"
		},
		"arch-3": {
			zoomOut: "arch-home",
			left: "arch-2",
			right: "arch-4"
		},
		"arch-4": {
			zoomOut: "arch-home",
			left: "arch-3"
		},
		"future-home": {
			up: "arch-home",
			zoomIn: "future-1",
			down: "user-home"
		},
		"future-1": {
			zoomOut: "future-home",
			right: "future-2"
		},
		"future-2": {
			zoomOut: "future-home",
			left: "future-1",
			right: "future-3"
		},		
		"future-3": {
			zoomOut: "future-home",
			left: "future-2",
			right: "future-4"
		},		
		"future-4": {
			zoomOut: "future-home",
			left: "future-3"

		},		
	};

	Jazz.init({
		fingerWaitTimer: 600,
		disableZoom: false
	});

	Jazz.on("navigation", function(nav) {
		var activeId = $(".active").attr("id");

		if (navigationMap[activeId]) 
			go(navigationMap[activeId][nav])
	});

	impress().init();

	function go(href) {
		window.location.href="#"+href;
	}

});