var hourglass = (function () {
    // nouvelle branche pour explorer forcefeed
    var workTime = 7000;
    var breakTime = 7000;
    var timeMark = 0;
    var upside = true;

    var lhaut = $("svg").find("#liquideHaut");
    var lbas  = $("svg").find("#liquideBas");
    var lflux = $("svg").find("#liquideFlux");
    var lturn = $("svg").find("#glass").find("#liquidTurn");

    var tomatoRed = "#E40008";
    var tomatoGreen = "#547E35";

    // glass/liquid geometry
    var turnStartLine, turnEndLine, rotateAngle, liquidColor, runTime;
    var glassTop = 65;
    var glassBottom = 465;
    var airGapFromTop = 20;    // should be computed from 
    var airGapFromNeck = 60;   // glass size and liquid volume
    var glassHeight = glassBottom - glassTop; // 200;
    var glassNeck = (glassHeight / 2) + glassTop; // 265;
    var liqHeightFromEdge = glassHeight / 2 - airGapFromNeck; // 140;
    var liqHeightFromCentre = glassHeight / 2 - airGapFromTop; // 180;
    
    var rotateTime = 1000;
    
    function setWorkTime(time) {
        workTime = time;
    }
    function setBreakTime(time) {
        breakTime = time;
    }
    
    function stop() {
        // a completer
        lhaut.find("rect").velocity("stop");
        lbas.find("rect").velocity("stop");
    }
    
    function rotateGlass() {
        // hourglass is upside (starting state)
        if (upside) {
            // during rotation, a dummy element (lturn) is replacing the top,
            // bottom and flux liquids.  This dummy element start and end need
            // to be referred from bottom to top
            turnStartLine = glassBottom - liqHeightFromEdge; // 325
            turnEndLine = turnStartLine - airGapFromNeck; // 265
            
            rotateAngle = "180deg";
            liquidColor = tomatoRed;
            runFluidTime = workTime;
           
            upside = false;
            
        } else {
            // hourglass is turned from upside-down to upright direction
            // References for the dummy element change accordingly
            turnStartLine = glassTop; // 65
            turnEndLine = glassTop + airGapFromTop; // 85
            
            rotateAngle = "0deg";
            liquidColor = tomatoGreen;
            runFluidTime = breakTime;
            
            upside = true;
            
        }

        // rotate 
        // ======    
        // setting the dummy rectangle instead of the bottom and top one
        lturn.find("rect").attr("y", turnStartLine);
        lturn.find("rect").attr("height", liqHeightFromEdge);
        lturn.css("display", "inline");
        lhaut.css("display", "none");
        lbas.css("display", "none");

        // rotate the whole hourglass
        $("#glass").velocity({ rotateZ: rotateAngle }, rotateTime);

        lturn.find("rect")
        // liquid change color while hourglass is turned upside-down
        .velocity({ fill: liquidColor }, rotateTime)
        // move the liquid down to the bottleneck
        .velocity({
            y: [turnEndLine, turnStartLine],
            height: [liqHeightFromCentre, liqHeightFromEdge]
        }, {
            delay: rotateTime - 250,
            queue: false, 
            complete: function () {
                // Replacing the dummy liquid rotation element with liquids
                // elements setted at their proper values, similarly to case
                // above
                lturn.css("display", "none");
                lhaut.css("display", "inline");
                lbas.css("display", "inline");
                lhaut.find("rect").css("fill", liquidColor);
                lbas.find("rect").css("fill", liquidColor);
                lflux.find("rect").css("fill", liquidColor);

                runFluid(runFluidTime);
            }
        });
    }

    function runFluid (flowTime) {
        // Fluid in the upper part is flowing down, filling the lower part.
       
        
        if (flowTime > 6000) {
            // Run a less cpu-intensive animation (i.e.: without velocity) if
            // the flowtime is long enough
            var compteur = flowTime;
            var pct = 1;
            lflux.css("display", "inline");
            lhaut.find("rect").attr( "y", glassNeck - liqHeightFromCentre );
            lhaut.find("rect").attr("height", liqHeightFromCentre );
            lbas.find("rect").attr("y", glassBottom);
            lbas.find("rect").attr("height", 0);

            // show time spent and time left
            $('#remain').css("display", "inline");
            $('#runned').css("display", "inline");
            $('#remain').html(formatTime(flowTime));
            $('#runned').html(formatTime(0));
            
            var moveRect = function() {
                compteur -= 1000;
                pct = compteur / flowTime;

                lhaut.find("rect").attr( "y", 
                        glassNeck - pct * liqHeightFromCentre );
                lhaut.find("rect").attr("height", pct * liqHeightFromCentre );
                lbas.find("rect").attr("y", 
                        glassBottom - liqHeightFromEdge * (1 - pct));
                lbas.find("rect").attr("height", liqHeightFromEdge * (1 - pct));
               
                // update time spent and time left
                $('#remain').html(formatTime(compteur));
                $('#runned').html(formatTime(flowTime - compteur));
                
                if (compteur <= 0) {
                    clearInterval(anim);
                    // remove time display
                    $('#remain').css("display", "none");
                    $('#runned').css("display", "none");
                    setTimeout(rotateGlass(), 1000);
                } else if (compteur <= 1000) {
                    lflux.css("display", "none");
                    lhaut.css("display", "none");
                }
            };
            var anim = setInterval(moveRect, 1000);
       
        } else {
            // Run a velocity animation for flowing liquid
            lhaut.find("rect").velocity({
                y: [glassNeck, glassTop + airGapFromTop], // from 85 to 265
                height: [0, liqHeightFromCentre]  // from 180 to 0
            }, {
                duration: flowTime, 
                easing: [1, 0.79, 1, 0.79],
                begin: function () {
                    // show liquid rope
                    lflux.css("display", "inline");
                    // show time spent and time left
                    $('#remain').css("display", "inline");
                    $('#runned').css("display", "inline");
                },
                progress: function (elements, complete, remaining) {
                    // update time spent and time left
                    if (Math.floor(remaining / 1000) !== timeMark) {
                        // only call function every second
                        $('#remain').html(formatTime(remaining));
                        $('#runned').html(formatTime(flowTime - remaining));
                        timeMark = Math.floor(remaining / 1000);
                    }
                },
                complete: function () {
                    // remove the liquid rope
                    lflux.css("display", "none");
                    // remove time display
                    $('#remain').css("display", "none");
                    $('#runned').css("display", "none");
                    rotateGlass();
                }
            });

            // fluid accumulates in glass' lower part
            lbas.find("rect").velocity({
                y: [glassNeck + airGapFromNeck, glassBottom], // from 465 to 325
                height: [liqHeightFromEdge, 0]  // from 0 to 140
            }, {
                duration: flowTime,
                easing: [0.76, 0.54, 0.89, 0.69]
            });
        }
    }

    return {
        setWorkTime: setWorkTime,
        setBreakTime: setBreakTime,
        rotate: rotateGlass,
        stop: stop
    };

}) ();

function formatTime(milliseconds) {
    var min = Math.floor(milliseconds / 60000);
    var sec = (milliseconds - (min * 60000)) / 100000;
    var time = (min + sec).toFixed(2);
    return time.replace('.', ':');
}

$(function () {
    var running = false;
    
    var scale = 1;
    var timeScale = [
        {multiplier: 1, abbrev: "sec."},
        {multiplier: 60, abbrev: "min."}
    ]; 

    $(".container").find("#start").click(function () {
        if ($(this).find("button").html() === "Stop") {
            hourglass.stop();
            $(this).find("button").html("Restart");
        } else {
            hourglass.rotate();
            $(this).find("button").html("Stop");
        }
    });

    function makeIconToolTip(id, timeUnit) {
        return function(e) {
            return "<div><img src=\"img/" + id + "-64.gif\" /><br />" + 
                e.value + " " + timeUnit + "</div>";
        };
    }

    $("#sessionset").find("div").roundSlider({
        radius: 70,
        width: 13,
        max: 60,
        circleShape: "pie",
        sliderType: "min-range",
        showTooltip: true,
        tooltipFormat: makeIconToolTip("work", timeScale[scale].abbrev),
        value: 20,
        editableTooltip: false,
        stop: function(e) {
            hourglass.setWorkTime(e.value * 1000 * timeScale[scale].multiplier);
        },
        startAngle: 315
    });
    
    $("#breakset").find("div").roundSlider({
        radius: 70,
        width: 13,
        max: 30,
        circleShape: "pie",
        sliderType: "min-range",
        showTooltip: true,
        tooltipFormat: makeIconToolTip("rest", timeScale[scale].abbrev),
        value: 10,
        editableTooltip: false,
        stop: function(e) {
            hourglass.setBreakTime(e.value * 1000 * timeScale[scale].multiplier);
        },
        startAngle: 315
    });
});
