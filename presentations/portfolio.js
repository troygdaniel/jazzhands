$(function () {

    impress().init();

    var navigationMap = {
        start: {
            down: "first-home",
            zoomIn: "first-home",
            zoomOut: "start"
        },
        "first-home": {
            left: "first-home",
            right: "second-home",
            down: "first-1",
            zoomIn: "first-1",
            zoomOut: "start",
            up: "start"
        },
        "first-1": {
            up: "first-home",
            left: "first-3",
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
            zoomOut: "first-home"
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
            left: "second-1",
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
            zoomOut: "second-home"
        },
        "third-home": {
            left: "second-home",
            down: "third-1",
            zoomIn: "third-1",
            zoomOut: "start",
            up: "start"
        },
        "third-1": {
            up: "third-home",
            left: "third-1",
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
            up: "third-home"
        }
    };

    Jazz.init({
        disableZoom: false,
        disableFingers: true,
        // fingersHoverText: ["Zoom out?!","Zoom In!"],
        waitTimer: 450
    });

    Jazz.on("navigation", function (nav) {
        var activeId = $(".active").attr("id");
        $("#navigation-debug").html("<B>&gt;</B> " + nav);
        if (navigationMap[activeId]) {
            go(navigationMap[activeId][nav])
            onTarget(navigationMap[activeId][nav]);
        }
    });

    $(document).keypress(function (e) {
        if (e.which == 49) {
            window.location.href = "#first-home";
        }
        if (e.which == 50) {
            window.location.href = "#second-home";
        }
        if (e.which == 51) {
            window.location.href = "#third-home";
        }
        if (e.which == 32) {
            var isMainTopic = ($(".active").attr("id").indexOf("home") >= 0 || $(".active").attr("id").indexOf("main") >= 0);
            var currentTopic = $(".active").attr("id").substring(0, $(".active").attr("id").indexOf("-"));

            if (isMainTopic === true)
                window.location.href = "#start";
            else
                window.location.href = "#" + currentTopic + "-home";
        } // esc   (does not work)
    });

    function go(href) {
        if (href + "" != "undefined")
            window.location.href = "#" + href;
    }

    function onTarget(href) {
        window.captureFrames = false;
        if (href === "second-1") {
            Jazz.setFingersText(["Zoom Out?", "Zoom in?"]);
            Jazz.disableHelper = true;
            // Jazz.WAIT_FINGER_MS=1800;
        } else if (href === "third-1") {
            Jazz.disableHelper = true;
        } else if (href === "third-2") {
            window.captureFrames = true;
        } else if (href === "second-3") {
            Jazz.disableHelper = true;
        } else {
            Jazz.clearFingersText();
            Jazz.disableHelper = false;
        }
    }

});