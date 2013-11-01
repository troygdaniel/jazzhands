$(function() {
    window.showTheme = function(themeName) {
        $(".space-theme").hide();
        $(".sunrise-theme").hide();
        $("." + themeName).show();

        if (themeName === "sunrise-theme") {
            $(".pres-1-title").css("color", "white");
            $(".pres-shortDesc").css("color", "white");

            $(".pres-title").css("color", "white");
            $(".pres-2-title").css("color", "white");
            $(".pres-3-title").css("color", "white");
        } else if (themeName === "space-theme") {
            $(".pres-1-title").css("color", "white");
            $(".pres-title").css("color", "white");
            $(".pres-shortDesc").css("color", "white");
            $(".pres-longDesc").css("color", "white");

            $(".pres-1-shortDesc").css("color", "white");
            $(".pres-1-longDesc").css("color", "white");

            $(".pres-2-title").css("color", "white");
            $(".pres-2-shortDesc").css("color", "white");
            $(".pres-2-longDesc").css("color", "#A4A4A4");
        } else {
            $(".pres-1-title").css("color", "black");
            $(".pres-title").css("color", "black");
            $(".pres-shortDesc").css("color", "black");
            $(".pres-longDesc").css("color", "black");

            $(".pres-1-shortDesc").css("color", "black");
            $(".pres-1-longDesc").css("color", "black");

            $(".pres-2-title").css("color", "black");
            $(".pres-2-shortDesc").css("color", "black");
            $(".pres-2-longDesc").css("color", "black");
        }
    }

    window.presentation = {
        title: "Troy Daniel | Portfolio",
        shortDesc: "A brief history of my time, in the interwebs.",
        longDesc: "This template can be edited dynamically allowing you to create a presentation with no more than 3 main topics.  Each main topic can have no more than three sub topics.",
        topics: [{
            title: "The Dot-Com Boom",
            shortDesc: "Graduating from college right into the dot-com boom, I was fortunate to be thrust into leadership of high-profile web applications.  ",
            longDesc: "At GE, I was exposed the complexities of a large corporate machine.  As a Team Lead at a startup, I understood the wholistic view of development.  As a Business Analyst at Filogix, I leveraged my broad skills to lead teams from inception to production launch.",
            subTopics: [{
                title: "GE Capital",
                desc: "Worked as a consultant to build an Asset Tracking application (CycleTrack).  In the early days of the web, ORM's and OO programming weren't common place. 'WebObjects' had solid traction in the Coroporate world."
            }, {
                title: "Whitecap Canada",
                desc: "Launched 'Just White Shirts' from a fax machine operation to the web. Introduced basic development best-practices.  Mentored developers in design, planning and troubleshooting.  Moved from Objective-C to Java, Linux, Apache"
            }, {
                title: "Filogix Expert",
                desc: "Lead the technical and product teams in a large-scale Data Conversion project. Moved from existing legacy systems to new system that dominated the market in the Mortgage Broker POS space."
            }]
        }, {
            title: "Web Two-point-oh",
            shortDesc: "Adobe Flex/Air, GWT, jQuery, RIA's and shiny glossy iconic experiences.  As the web slowly matured, so did my skills and experience. ",
            longDesc: "At TD, I introduced AJAX and JavaScript to a back-office application.  At D+H, I worked on an R&D team and gained usability/ux experience.  At YesMail, I continued along the R&D path and developed front-end JavaScript PoC's that consumed RESTful services.",
            subTopics: [{
                title: "TD Canada Trust",
                desc: "Lead and introduced advanced JavaScript options (XMLHttpRequest) to integrate the new J2EE app and existing legacy systems."
            }, {
                title: "Davis+Henderson",
                desc: "The CTO handpicked 5 individuals to work on an R&D team. Lead multiple teams in implementing business-rules engine service. Introduced usability best-practices to address to defend their dominance in marketplace."
            }, {
                title: "YesMail",
                desc: "Built front-end heavy PoC's to showcase emerging technology and potential products.  Introduce Front-End architecture using jQuery and Backbone.js. Integrated with Hadoop/Mahout using RESTful webservices and Backbone.js."
            }]
        }, {
            title: "Mobile & Front-end",
            shortDesc: "I've been fortunate to have built mobile products that have gained attention in the news.  I've learned and been burned by iPhone and mobile web development.",
            longDesc: "As a side project, I built a friend finder application that got press from Wired and ABC news.  As a contract, I built 'Family Finder' which was later sold to Rogers for the 'Phone Finder'.",
            subTopics: [{
                title: "Where The Flock",
                desc: "Side project in the early days of the iPhone that allowed users to track friends and family.  Received mention in a Wired 'GeekDad' article that was picked up by ABC news online."
            }, {
                title: "Phone Finder",
                desc: "Built 'FamilyFinder' was later purchased and implemented as Rogers Phone Finder.  Mobile web development using Rails, HTML and JavaScript. Deployed solutions onto Heroku and Amazon EC2."
            }, {
                title: "Mosaic",
                desc: "While at Mosaic, I had the opportunity to serve as a Scrum Master of 20+ during a critical launch period. Lead and implemented best-practices of Scrum, by splitting the teams and implementing basic Scrum ceremonies."
            }]
        }, ]
    };

    loadUI();
    // Load space theme
    // window.showTheme("space-theme");
    // window.showTheme("sunrise-theme");

    var store = new Lawnchair({
        name: 'jazz'
    }, function(store) {
        var me = {
            key: 'presentation',
            value: window.presentation
        };
        store.save(me);
        store.get('presentation', function(me) {
            console.log(me.value);
        });
    });

    function loadUI() {
        var p = window.presentation;

        $(".pres-title").html(p.title);
        $(".pres-shortDesc").html(p.shortDesc);
        $(".pres-longDesc").html(p.longDesc);

        loadTopic(0);
        loadTopic(1);
        loadTopic(2);
    };

    function loadTopic(indx) {
        var cssIndx = indx + 1;
        var p = window.presentation;

        $(".pres-" + cssIndx + "-title").html("" + cssIndx + ". " + p.topics[indx].title);
        $(".pres-" + cssIndx + "-shortDesc").html(p.topics[indx].shortDesc);
        $(".pres-" + cssIndx + "-longDesc").html(p.topics[indx].longDesc);

        $(".pres-" + cssIndx + "-1-title").html(p.topics[indx].subTopics[0].title);
        $(".pres-" + cssIndx + "-1-desc").html(p.topics[indx].subTopics[0].desc);

        $(".pres-" + cssIndx + "-2-title").html(p.topics[indx].subTopics[1].title);
        $(".pres-" + cssIndx + "-2-desc").html(p.topics[indx].subTopics[1].desc);

        $(".pres-" + cssIndx + "-3-title").html(p.topics[indx].subTopics[2].title);
        $(".pres-" + cssIndx + "-3-desc").html(p.topics[indx].subTopics[2].desc);
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