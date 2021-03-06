$(function() {
    window.showTheme = function (themeName) {
        $(".space-theme").hide();
        $(".sunrise-theme").hide();
        $("."+themeName).show();

        if (themeName === "sunrise-theme") {
            $(".pres-1-title").css("color","white");
            $(".pres-shortDesc").css("color","white");

            $(".pres-title").css("color","white");
            $(".pres-2-title").css("color","white");
            $(".pres-3-title").css("color","white");
        }
        else if (themeName === "space-theme") {
            $(".pres-1-title").css("color","white");
            $(".pres-title").css("color","white");
            $(".pres-shortDesc").css("color","white");
            $(".pres-longDesc").css("color","white");

            $(".pres-1-shortDesc").css("color","white");
            $(".pres-1-longDesc").css("color","white");

            $(".pres-2-title").css("color","white");
            $(".pres-2-shortDesc").css("color","white");
            $(".pres-2-longDesc").css("color","#A4A4A4");
        }
        else {
            $(".pres-1-title").css("color","black");
            $(".pres-title").css("color","black");
            $(".pres-shortDesc").css("color","black");
            $(".pres-longDesc").css("color","black");

            $(".pres-1-shortDesc").css("color","black");
            $(".pres-1-longDesc").css("color","black");

            $(".pres-2-title").css("color","black");
            $(".pres-2-shortDesc").css("color","black");
            $(".pres-2-longDesc").css("color","black");            
        }
    }

    window.presentation = {
        title: "Presentation name",
        shortDesc: "This template is a dynamically loaded presentation",
        longDesc: "This template can be edited dynamically allowing you to create a presentation with no more than 3 main topics.  Each main topic can have no more than three sub topics.",
        topics: [{
            title: "First topic title",
            shortDesc: "The 1st topic is presented at the beginning, and is followed by the second topic.",
            longDesc: "The 1st topic is presented at the beginning, and is followed by the second topic. The 1st topic is presented at the beginning, and is followed by the second topic. ",
            subTopics: [{
                title: "First 1",
                desc: "1.1 desc -1Id iisque oblique dolorem eos. Mei voluptua appellantur ex. Et ius melius consulatu sententiae, pri no enim debet harum. Ullum utamur civibus vis an, facilisi iudicabit at nam."
            }, {
                title: "First 2",
                desc: "1.2 desc Id iisque oblique dolorem eos. Mei voluptua appellantur ex. Et ius melius consulatu sententiae, pri no enim debet harum. Ullum utamur civibus vis an, facilisi iudicabit at nam."
            }, {
                title: "First 3",
                desc: "1.3 desc Id iisque oblique dolorem eos. Mei voluptua appellantur ex. Et ius melius consulatu sententiae, pri no enim debet harum. Ullum utamur civibus vis an, facilisi iudicabit at nam."
            }
            ]
        }, {
            title: "Second topic title",
            shortDesc: "The 2nd topic is presented at the beginning, and is followed by the second topic.",
            longDesc: "The 2nd topic is presented at the beginning, and is followed by the second topic. The 2nd topic is presented at the beginning, and is followed by the second topic. ",
            subTopics: [{
                title: "Second 1",
                desc: "2.1 Id iisque oblique dolorem eos. Mei voluptua appellantur ex. Et ius melius consulatu sententiae, pri no enim debet harum. Ullum utamur civibus vis an, facilisi iudicabit at nam."
            }, {
                title: "Second 2",
                desc: "2.2 Id iisque oblique dolorem eos. Mei voluptua appellantur ex. Et ius melius consulatu sententiae, pri no enim debet harum. Ullum utamur civibus vis an, facilisi iudicabit at nam."
            }, {
                title: "Second 3",
                desc: "2.3 Id iisque oblique dolorem eos. Mei voluptua appellantur ex. Et ius melius consulatu sententiae, pri no enim debet harum. Ullum utamur civibus vis an, facilisi iudicabit at nam."
            }
            ]
        }, {
            title: "Third topic title",
            shortDesc: "The 3rd topic is presented at the beginning, and is followed by the second topic.",
            longDesc: "3 longDesc ipsum dolor sit amet, alii inani partem ut pro. Imperdiet reformidans duo cu, et qui movet feugiat verterem. Te vel fuisset sapientem hendrerit, usu cu summo labore mediocrem. ",
            subTopics: [{
                title: "Third 1",
                desc: "3.1 Id iisque oblique dolorem eos. Mei voluptua appellantur ex. Et ius melius consulatu sententiae, pri no enim debet harum. Ullum utamur civibus vis an, facilisi iudicabit at nam."
            }, {
                title: "Third 2",
                desc: "3.2 Id iisque oblique dolorem eos. Mei voluptua appellantur ex. Et ius melius consulatu sententiae, pri no enim debet harum. Ullum utamur civibus vis an, facilisi iudicabit at nam."
            }, {
                title: "Third 3",
                desc: "3.3 Id iisque oblique dolorem eos. Mei voluptua appellantur ex. Et ius melius consulatu sententiae, pri no enim debet harum. Ullum utamur civibus vis an, facilisi iudicabit at nam."
            }
            ]
        }, ]
    };

    loadUI();
    // Load space theme
    window.showTheme("space-theme");
    // window.showTheme("sunrise-theme");

    var store = new Lawnchair({name:'jazz'}, function(store) {
        var me = {key:'presentation',value:window.presentation};
        store.save(me);
        store.get('presentation', function(me) {
            console.log(me.value);
        });
    });
    function loadUI(){
        var p = window.presentation;

        $(".pres-title").html(p.title);
        $(".pres-shortDesc").html(p.shortDesc);
        $(".pres-longDesc").html(p.longDesc);

        loadTopic(0);
        loadTopic(1);
        loadTopic(2);
    };

    function loadTopic(indx) {
        var cssIndx = indx+1;
        var p = window.presentation;

        $(".pres-"+cssIndx+"-title").html(""+cssIndx+". " + p.topics[indx].title);
        $(".pres-"+cssIndx+"-shortDesc").html(p.topics[indx].shortDesc);
        $(".pres-"+cssIndx+"-longDesc").html(p.topics[indx].longDesc);

        $(".pres-"+cssIndx+"-1-title").html(p.topics[indx].subTopics[0].title);
        $(".pres-"+cssIndx+"-1-desc").html(p.topics[indx].subTopics[0].desc);

        $(".pres-"+cssIndx+"-2-title").html(p.topics[indx].subTopics[1].title);
        $(".pres-"+cssIndx+"-2-desc").html(p.topics[indx].subTopics[1].desc);
        
        $(".pres-"+cssIndx+"-3-title").html(p.topics[indx].subTopics[2].title);
        $(".pres-"+cssIndx+"-3-desc").html(p.topics[indx].subTopics[2].desc);        
    }

    impress().init();    
    Jazz.init({
        disableZoom: true,
        disableFingers: true,
        waitTimer: 450
    });

    Jazz.on("navigation", function(nav) {
        var activeId = $(".active").attr("id");
        if (navigationMap[activeId]) {
            go(navigationMap[activeId][nav]);
            onTarget(navigationMap[activeId][nav]);
        }
    });

    $(document).keypress(function(e) {
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