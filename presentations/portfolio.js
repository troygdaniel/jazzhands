$(function () {

    impress().init();


    Jazz.init({
        disableZoom: true,
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
    }

});